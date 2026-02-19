import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-4" />
            <p className="text-muted-foreground">{message}</p>
        </div>
    );
}
