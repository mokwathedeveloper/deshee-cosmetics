'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DataTableToolbarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    filterElement?: React.ReactNode;
    actionElement?: React.ReactNode;
}

export function DataTableToolbar({
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    filterElement,
    actionElement,
}: DataTableToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>
            {filterElement && <div className="w-full sm:w-48">{filterElement}</div>}
            {actionElement}
        </div>
    );
}

interface DataTablePaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    itemLabel?: string;
    onPageChange: (page: number) => void;
}

export function DataTablePagination({
    currentPage,
    totalItems,
    itemsPerPage,
    itemLabel = 'items',
    onPageChange,
}: DataTablePaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
                Showing {start} to {end} of {totalItems} {itemLabel}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
