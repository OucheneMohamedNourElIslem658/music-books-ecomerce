import { Media } from '@/components/Media'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Link } from '@/i18n/navigation'
import { Order } from '@/payload-types'
import { FileText, Map as MapIcon, Sparkles } from 'lucide-react'

type Props = {
  order: Order
}

export const OrderItem: React.FC<Props> = ({ order }) => {
  const firstItem = order.items?.[0]
  const product = firstItem?.product

  let image = null
  if (product && typeof product === 'object') {
    image = product.gallery?.[0]?.image || product.meta?.image
  }

  return (
    <div className="group flex flex-col md:flex-row gap-6 bg-card/30 rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
      {/* Background Icon Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Sparkles size={120} />
      </div>

      {/* Image Section */}
      <div className="w-full md:w-48 h-40 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border relative">
        {image && typeof image !== 'string' ? (
          <Media fill imgClassName="object-cover transition-transform duration-700 group-hover:scale-110" resource={image} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <FileText size={40} />
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 justify-between gap-6 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {order.status && <OrderStatus status={order.status} />}
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              {/* Scribed: {formatDateTime({ date: order.createdAt, format: 'do of MMMM' })} */}
            </span>
          </div>
          <h3 className="text-xl font-bold leading-tight">
            {product && typeof product === 'object' ? product.title : `Order Archive #${order.id}`}
            {order.items && order.items.length > 1 && (
              <span className="text-muted-foreground text-sm font-medium ml-2">
                & {order.items.length - 1} more artifacts
              </span>
            )}
          </h3>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
            Order ID: {order.id} • Sent via {order.status === 'processing' ? 'Phoenix Express' : 'Owl Delivery'}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={`/orders/${order.id}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-black uppercase tracking-widest transition-all"
          >
            <FileText size={14} />
            View Scroll
          </Link>
          <button className="text-accent-gold hover:text-accent-gold/80 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
            {order.status === 'processing' ? 'Locate Courier' : 'View Ritual'}
            <MapIcon size={14} />
          </button>
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10 min-w-[140px] relative z-10">
        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest md:mb-1">Gold Value</span>
        {order.amount && (
          <Price
            amount={order.amount}
            className="text-xl md:text-2xl font-black text-accent-gold"
          />
        )}
      </div>
    </div>
  )
}
