'use client'

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { useRouter } from 'next/navigation'

interface PaginationControllerProps {
    page: number
    totalPages: number
}

export function PaginationController({ page, totalPages }: PaginationControllerProps) {
    const router = useRouter()

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`)
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        aria-disabled={page <= 1}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            onClick={() => handlePageChange(p)}
                            isActive={p === page}>
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        aria-disabled={page >= totalPages}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}