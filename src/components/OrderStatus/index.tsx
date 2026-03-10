import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { CheckCircle2, RefreshCcw, XCircle, AlertCircle } from 'lucide-react'

type Props = {
  status: StatusOptions
  className?: string
}

export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <RefreshCcw size={12} className="animate-spin" />,
          label: 'Teleporting',
          color: 'bg-primary/10 text-primary border-primary/20',
        }
      case 'completed':
        return {
          icon: <CheckCircle2 size={12} />,
          label: 'Artifact Acquired',
          color: 'bg-success/10 text-success border-success/20',
        }
      case 'cancelled':
        return {
          icon: <XCircle size={12} />,
          label: 'Vanished',
          color: 'bg-destructive/10 text-destructive border-destructive/20',
        }
      case 'refunded':
        return {
          icon: <AlertCircle size={12} />,
          label: 'Gold Returned',
          color: 'bg-warning/10 text-warning border-warning/20',
        }
      default:
        return {
          icon: <RefreshCcw size={12} />,
          label: status || 'Pending',
          color: 'bg-secondary text-muted-foreground border-border',
        }
    }
  }

  const { icon, label, color } = getStatusDisplay()

  return (
    <div
      className={cn(
        'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-2 w-fit',
        color,
        className,
      )}
    >
      {icon}
      {label}
    </div>
  )
}
