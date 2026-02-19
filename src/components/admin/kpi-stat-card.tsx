import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPIStatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    iconBgColor?: string;
    iconColor?: string;
}

export function KPIStatCard({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'positive',
    iconBgColor = 'bg-muted', // Use theme muted background
    iconColor = 'text-primary', // Use theme primary color
}: KPIStatCardProps) {
    const changeColor =
        changeType === 'positive'
            ? 'text-success' // Use theme semantic success color
            : changeType === 'negative'
                ? 'text-destructive' // Use theme semantic destructive color
                : 'text-warning'; // Use theme semantic warning color

    return (
        <Card className="border shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    {change && (
                        <span className={`text-xs font-medium ${changeColor}`}>{change}</span>
                    )}
                </div>
                <div className="mt-3">
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
