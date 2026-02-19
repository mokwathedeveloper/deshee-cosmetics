import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: number; // Tailwind size classes like 'h-4 w-4'
}

export function LoadingState({
  text = "Loading...",
  size = 6, // Corresponds to Tailwind's h-6 w-6
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 text-center",
        className
      )}
      {...props}
    >
      <Loader2 className={cn(`h-${size} w-${size} animate-spin text-primary`)} />
      <p className="mt-4 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
