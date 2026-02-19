import { getStockStatus } from '@/lib/utils';

export function StockBadge({ stock }: { stock: number }) {
    const { label } = getStockStatus(stock);

    const colorClass =
        stock === 0
            ? 'bg-red-100 text-red-700'
            : stock <= 20
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
            {label}
        </span>
    );
}
