import { Grid } from '@/components/Grid'

export default function Loading() {
    return (
        <Grid className="grid-cols-1 gap-4">
            {Array(6).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900 h-36"
                />
            ))}
        </Grid>
    )
}