import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({
    message = 'Something went wrong.',
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-foreground font-medium mb-2">Error</p>
            <p className="text-muted-foreground mb-4">{message}</p>
            {onRetry && (
                <Button variant="outline" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}
