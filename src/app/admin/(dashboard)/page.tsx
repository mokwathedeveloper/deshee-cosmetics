import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { KPIStatCard } from '@/components/admin/kpi-stat-card';
import { getAdminDashboardStats } from '@/actions/products';
import { getAllOrders } from '@/actions/orders';
import { formatCurrency, formatDateShort, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPIStatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                />
                <KPIStatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <KPIStatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-600"
                />
                <KPIStatCard
                    title="Low Stock Alerts"
                    value={stats.lowStockAlerts}
                    icon={AlertTriangle}
                    iconBgColor="bg-orange-100"
                    iconColor="text-orange-600"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-pink-500 hover:text-pink-600">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium">Order</th>
                                <th className="text-left px-4 py-3 font-medium">Customer</th>
                                <th className="text-left px-4 py-3 font-medium">Date</th>
                                <th className="text-right px-4 py-3 font-medium">Total</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/orders/${order.id}`} className="text-pink-500 hover:text-pink-600 font-medium">
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{order.customer_name}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatDateShort(order.created_at)}</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
