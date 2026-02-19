import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${year}-${rand}`;
}

export function getStockStatus(stock: number): { label: string; variant: 'default' | 'destructive' | 'secondary' } {
  if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' };
  if (stock <= 20) return { label: 'Low Stock', variant: 'secondary' };
  return { label: 'In Stock', variant: 'default' };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-info/20 text-info-foreground',
    processing: 'bg-warning/20 text-warning-foreground',
    shipped: 'bg-info/20 text-info-foreground',
    delivered: 'bg-success/20 text-success-foreground',
    cancelled: 'bg-destructive/20 text-destructive-foreground',
    active: 'bg-success/20 text-success-foreground',
    inactive: 'bg-muted/20 text-muted-foreground',
  };
  return colors[status] || 'bg-muted/20 text-muted-foreground';
}
