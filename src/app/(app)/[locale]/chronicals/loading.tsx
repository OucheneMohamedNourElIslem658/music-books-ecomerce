import { Grid } from '@/components/Grid'

export default function Loading() {
    return (
        <div className="flex flex-col gap-12">
            {/* Hero skeleton */}
            <div className="rounded-2xl bg-muted animate-pulse h-[400px] w-full" />
            
            <div className="space-y-8">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
                <Grid className="grid-cols-1 gap-8">
                    {Array(3).fill(0).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-2xl bg-muted h-64 w-full"
                        />
                    ))}
                </Grid>
            </div>
        </div>
    )
}