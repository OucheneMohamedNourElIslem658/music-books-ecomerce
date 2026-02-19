import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import Link from 'next/link'

type Props = {
  order: Order
}

export const OrderItem: React.FC<Props> = ({ order }) => {
  const itemsLabel = order.items?.length === 1 ? 'Item' : 'Items'

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">

          {/* Order ID */}
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground truncate max-w-32 sm:max-w-none">
            #{order.id}
          </p>

          {/* Date + Status */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3">
            <p className="text-base font-medium">
              <time dateTime={order.createdAt}>
                {formatDateTime({ date: order.createdAt, format: 'MMMM dd, yyyy' })}
              </time>
            </p>
            {order.status && <OrderStatus status={order.status} />}
          </div>

          <Separator />

          {/* Items + Price */}
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{order.items?.length} {itemsLabel}</span>
            {order.amount && (
              <>
                <span>•</span>
                <Price as="span" amount={order.amount} currencyCode={order.currency ?? undefined} />
              </>
            )}
          </p>

        </div>

        <Button variant="outline" asChild className="self-start sm:self-auto shrink-0">
          <Link href={`/orders/${order.id}`}>View Order</Link>
        </Button>
      </CardContent>
    </Card>
  )
}