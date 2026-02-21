/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/payments/paypal/index.ts

import { PaymentAdapter, PaymentAdapterArgs } from '@payloadcms/plugin-ecommerce/types'
import { PaymentAdapterClient } from 'node_modules/@payloadcms/plugin-ecommerce/dist/types'
import { GroupField } from 'payload'

export interface PayPalAdapterArgs extends PaymentAdapterArgs {
  clientId: string
  clientSecret: string
  environment?: 'sandbox' | 'production'
  currency?: string
  intent?: string
  brandName?: string
  landingPage?: string
  shippingPreference?: string
  userAction?: string
}

function mapAddress(addr: any, fallbackName: string) {
  if (!addr) return undefined
  return {
    name: {
      fullName:
        [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim() ||
        addr.name ||
        fallbackName,
    },
    address: {
      addressLine1: addr.addressLine1 || addr.line1 || '',
      addressLine2: addr.addressLine2 || addr.line2 || undefined,
      adminArea2: addr.city || '',
      adminArea1: addr.state || addr.province || '',
      postalCode: addr.postalCode || addr.zip || '',
      countryCode: addr.country || 'US',
    },
  }
}

function formatPrice(value: number, divisor = 1): string {
  return (value / divisor).toFixed(2)
}

export const paypalAdapter = (args: PayPalAdapterArgs): PaymentAdapter => {
  const {
    clientId,
    clientSecret,
    environment = 'sandbox',
    currency = 'USD',
    intent = 'CAPTURE',
    brandName = 'My Store',
    landingPage = 'LOGIN',
    shippingPreference = 'GET_FROM_FILE',
    userAction = 'PAY_NOW',
    label = 'PayPal',
  } = args

  // Lazy-load the SDK at runtime only — not at module parse time.
  // This prevents Payload's generate:types from executing the SDK import.
  const getSDK = () => {
    const sdk = require('@paypal/paypal-server-sdk') // eslint-disable-line @typescript-eslint/no-require-imports
    return {
      Client: sdk.Client,
      Environment: sdk.Environment,
      OrdersController: sdk.OrdersController,
    }
  }

  const paypalGroupField: GroupField = {
    name: 'paypal',
    type: 'group',
    admin: {
      condition: (data) => data?.['paymentMethod'] === 'paypal',
    },
    fields: [
      { name: 'orderId', type: 'text', label: 'PayPal Order ID', admin: { readOnly: true } },
      { name: 'captureId', type: 'text', label: 'PayPal Capture ID', admin: { readOnly: true } },
      { name: 'payerId', type: 'text', label: 'PayPal Payer ID', admin: { readOnly: true } },
      { name: 'payerEmail', type: 'email', label: 'Payer Email', admin: { readOnly: true } },
      { name: 'status', type: 'text', label: 'PayPal Order Status', admin: { readOnly: true } },
      { name: 'createTime', type: 'date', label: 'Create Time', admin: { readOnly: true } },
      { name: 'updateTime', type: 'date', label: 'Update Time', admin: { readOnly: true } },
    ],
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIATE
  // ─────────────────────────────────────────────────────────────────────────
  const initiatePayment: NonNullable<PaymentAdapter>['initiatePayment'] = async ({
    data,
    req,
    transactionsSlug,
  }: any) => {
    const { Client, Environment, OrdersController } = getSDK()
    const payload = req.payload

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.headers.get?.('x-forwarded-proto') || 'http'}://${req.headers.get?.('host') || 'localhost:3000'}`

    const returnUrl = `${appUrl}/api/payments/paypal/return`
    const cancelUrl = `${appUrl}/api/payments/paypal/cancel`

    const paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: environment === 'production' ? Environment.Production : Environment.Sandbox,
    })

    const ordersController = new OrdersController(paypalClient)

    try {
      const { cart, currency: cartCurrency, customerEmail, billingAddress, shippingAddress } = data

      if (!cart?.items?.length) throw new Error('Cart is empty')
      if (!customerEmail) throw new Error('Customer email is required')

      const resolvedCurrency = cartCurrency || currency

      const items = cart.items.map((item: any) => {
        const product = typeof item.product === 'object' ? item.product : null
        const rawPrice = product?.priceInUSD ?? 0
        return {
          name: product?.title ?? String(item.product),
          unitAmount: { currencyCode: resolvedCurrency, value: formatPrice(rawPrice) },
          quantity: String(item.quantity || 1),
          description: product?.title ?? String(item.product),
          sku: String(product?.inventory ?? ''),
        }
      })

      const itemTotal = items.reduce(
        (sum: number, item: any) =>
          sum + parseFloat(item.unitAmount.value) * parseInt(item.quantity || '1'),
        0,
      )

      const resolvedShipping = shippingAddress || billingAddress
      const shipping = mapAddress(resolvedShipping, customerEmail)

      const { result: paypalOrder } = await ordersController.createOrder({
        body: {
          intent,
          purchaseUnits: [
            {
              referenceId: String(cart.id),
              description: `Order from ${brandName}`,
              customId: String(cart.id),
              invoiceId: `INV-${Date.now()}-${cart.id}`,
              amount: {
                currencyCode: resolvedCurrency,
                value: itemTotal.toFixed(2),
                breakdown: {
                  itemTotal: { currencyCode: resolvedCurrency, value: itemTotal.toFixed(2) },
                  shipping: { currencyCode: resolvedCurrency, value: '0.00' },
                  taxTotal: { currencyCode: resolvedCurrency, value: '0.00' },
                },
              },
              items,
              shipping,
            },
          ],
          paymentSource: {
            paypal: {
              experienceContext: {
                brandName,
                landingPage,
                shippingPreference: resolvedShipping ? 'SET_PROVIDED_ADDRESS' : shippingPreference,
                userAction,
                returnUrl,
                cancelUrl,
              },
            },
          },
        },
        prefer: 'return=representation',
        paypalRequestId: `order-${Date.now()}-${cart.id}`,
      })

      const transaction = await payload.create({
        collection: transactionsSlug,
        data: {
          paymentMethod: 'paypal',
          amount: itemTotal,
          currency: resolvedCurrency,
          status: 'pending',
          cart: cart.id,
          paypal: {
            orderId: paypalOrder.id,
            status: paypalOrder.status,
            createTime: paypalOrder.createTime,
          },
          metadata: {
            customerEmail,
            cartId: String(cart.id),
          },
          shippingAddress,
          billingAddress,
        },
      })

      const approvalUrl = paypalOrder.links?.find((l: any) => l.rel === 'payer-action')?.href
      if (!approvalUrl) throw new Error('No approval URL returned by PayPal')

      return {
        message: 'PayPal order created. Redirect user to approvalUrl.',
        approvalUrl,
        paypalOrderId: paypalOrder.id,
        transactionId: transaction.id,
        cartId: String(cart.id),
      }
    } catch (error: any) {
      payload.logger.error(error, 'Error creating PayPal order')
      let message = error.message || 'Failed to create PayPal order'
      if (error.result?.details?.length) {
        message = error.result.details.map((d: any) => `${d.field}: ${d.description}`).join('; ')
      }
      throw new Error(`PayPal Error: ${message}`)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIRM ORDER
  // ─────────────────────────────────────────────────────────────────────────
  const confirmOrder: NonNullable<PaymentAdapter>['confirmOrder'] = async ({
    data,
    req,
    ordersSlug = 'orders',
    transactionsSlug = 'transactions',
    cartsSlug = 'carts',
    customersSlug = 'users',
  }: any) => {
    const { Client, Environment, OrdersController } = getSDK()
    const payload = req.payload

    const paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: environment === 'production' ? Environment.Production : Environment.Sandbox,
    })

    const ordersController = new OrdersController(paypalClient)

    const {
      paypalOrderId,
      transactionId,
      cartId,
      customerEmail: emailFromData,
    } = data as {
      paypalOrderId: string
      transactionId: string
      cartId: string
      customerEmail?: string
    }

    if (!paypalOrderId) throw new Error('confirmOrder: paypalOrderId is required')
    if (!transactionId) throw new Error('confirmOrder: transactionId is required')
    if (!cartId) throw new Error('confirmOrder: cartId is required')

    console.log('paypal order id', paypalOrderId)
    console.log('transaction id', transactionId)
    console.log('cart id', cartId)
    console.log('customer email', emailFromData)

    try {
      const { result: captureResult } = await ordersController.captureOrder({
        id: paypalOrderId,
        prefer: 'return=representation',
      })

      const capture = captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]
      const payer = captureResult.payer
      const captureId = capture?.id
      const captureStatus = capture?.status
      const payerId = payer?.payerId
      const payerEmail = payer?.emailAddress

      if (!captureId) {
        throw new Error(
          `PayPal capture returned no capture ID. Order status: ${captureResult.status}`,
        )
      }

      if (captureStatus !== 'COMPLETED') {
        throw new Error(`Payment not completed — capture status: ${captureStatus}`)
      }

      const customerEmail = emailFromData ?? payerEmail ?? ''
      const timestamp = new Date().toISOString()

      let customerId: number | string | undefined
      if (req.user?.id) {
        customerId = req.user.id
      } else if (customerEmail) {
        const existing = await payload.find({
          collection: customersSlug,
          where: { email: { equals: customerEmail } },
          limit: 1,
        })
        customerId = existing.docs?.[0]?.id
      }

      const transaction = await payload.findByID({
        collection: transactionsSlug,
        id: transactionId,
        depth: 2,
      })

      const order = await payload.create({
        collection: ordersSlug,
        data: {
          items: transaction.cart?.items || [],
          shippingAddress: transaction.billingAddress,
          customer: customerId,
          customerEmail,
          status: 'processing',
          amount: transaction.amount,
          currency: transaction.currency,
        },
      })

      await payload.update({
        collection: cartsSlug,
        id: cartId,
        data: {
          purchasedAt: timestamp,
        },
      })

      await payload.update({
        collection: transactionsSlug,
        id: transactionId,
        data: {
          order: order.id,
          status: 'succeeded',
          paypal: {
            orderId: paypalOrderId,
            captureId,
            payerId,
            payerEmail,
            status: captureStatus,
            updateTime: captureResult.updateTime,
          },
        },
      })

      return {
        message: 'Payment captured and order created successfully',
        orderID: order.id,
        transactionID: parseInt(transactionId, 10),
      }
    } catch (error: any) {
      payload.logger.error(error, 'Error confirming PayPal order')
      let message = error.message || 'Failed to confirm PayPal payment'
      if (error.result?.details?.length) {
        message = error.result.details.map((d: any) => `${d.field}: ${d.description}`).join('; ')
      }
      throw new Error(`PayPal Confirm Error: ${message}`)
    }
  }

  return {
    confirmOrder,
    group: paypalGroupField,
    initiatePayment,
    label,
    name: 'paypal',
  }
}

export const paypalAdapterClient = (): PaymentAdapterClient => ({
  name: 'paypal',
  label: 'PayPal',
  initiatePayment: true,
  confirmOrder: true,
})