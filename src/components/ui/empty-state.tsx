import { Package } from 'lucide-react';

export function EmptyState({
    icon: Icon = Package,
    title = 'No items found',
    description = 'There are no items to display.',
}: {
    icon?: React.ComponentType<{ className?: string }>;
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-foreground font-medium mb-1">{title}</p>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );
}
