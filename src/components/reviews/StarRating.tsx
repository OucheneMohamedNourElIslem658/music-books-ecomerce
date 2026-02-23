import { StarIcon } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating) ? 'text-amber-400' : 'text-muted'}`}
          fill="currentColor"
        />
      ))}
    </div>
  )
}