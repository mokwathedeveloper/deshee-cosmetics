'use client';

import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load admin dashboard"
      description="We encountered an unexpected error. Please try again or contact support."
    >
      <Button onClick={() => reset()}>Try again</Button>
    </ErrorState>
  );
}
