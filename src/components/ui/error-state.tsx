import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import React from "react";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function ErrorState({
  icon: Icon = TriangleAlert,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
  children,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 text-center text-destructive",
        className
      )}
      {...props}
    >
      <Icon className="h-12 w-12" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {children}
    </div>
  );
}
