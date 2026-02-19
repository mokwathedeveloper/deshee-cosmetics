import { formatCurrency } from '@/lib/utils';

interface PriceTagProps {
    price: number;
    compareAtPrice?: number | null;
    size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, compareAtPrice, size = 'md' }: PriceTagProps) {
    const sizeClasses = {
        sm: { price: 'text-sm font-semibold', compare: 'text-xs' },
        md: { price: 'text-base font-bold', compare: 'text-sm' },
        lg: { price: 'text-2xl font-bold', compare: 'text-base' },
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`${sizeClasses[size].price} text-foreground`}>
                {formatCurrency(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
                <span className={`${sizeClasses[size].compare} text-muted-foreground line-through`}>
                    {formatCurrency(compareAtPrice)}
                </span>
            )}
        </div>
    );
}
