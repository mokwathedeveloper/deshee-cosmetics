'use client';

import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorState 
            title="Something went wrong" 
            description={error.message || "An unexpected error occurred"}
        >
            <Button onClick={reset} variant="outline">
                Try again
            </Button>
        </ErrorState>
    );
}
