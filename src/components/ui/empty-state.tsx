import { cn } from "@/lib/utils";
import { PackageX } from "lucide-react";
import React from "react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = PackageX,
  title = "No results found",
  description = "No items match your criteria. Please try again with different filters.",
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 text-center",
        className
      )}
      {...props}
    >
      <Icon className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {children}
    </div>
  );
}
