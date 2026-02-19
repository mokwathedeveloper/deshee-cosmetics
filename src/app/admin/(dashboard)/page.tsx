import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { KPIStatCard } from '@/components/admin/kpi-stat-card';
import { getAdminDashboardStats } from '@/actions/products';
import { getAllOrders } from '@/actions/orders';
import { formatCurrency, formatDateShort, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
    const [stats, recentOrdersRes] = await Promise.all([
        getAdminDashboardStats(),
        getAllOrders({ limit: 5 }),
    ]);

    const recentOrders = recentOrdersRes.orders;

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPIStatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    iconBgColor="bg-muted"
                    iconColor="text-success"
                />
                <KPIStatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    iconBgColor="bg-muted"
                    iconColor="text-info"
                />
                <KPIStatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    iconBgColor="bg-muted"
                    iconColor="text-primary"
                />
                <KPIStatCard
                    title="Low Stock Alerts"
                    value={stats.lowStockAlerts}
                    icon={AlertTriangle}
                    iconBgColor="bg-muted"
                    iconColor="text-warning"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-card border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-foreground">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-primary hover:text-primary/80">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:text-primary/80 font-medium">
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{order.customer_name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{formatDateShort(order.created_at)}</td>
                                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(order.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && (
                        <EmptyState
                            title="No orders found"
                            description="There are no recent orders to display."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
