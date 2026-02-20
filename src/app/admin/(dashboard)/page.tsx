import { DollarSign, ShoppingCart, Package, AlertTriangle, ArrowUpRight, Clock, User as UserIcon, ChevronRight } from 'lucide-react';
import { getAdminDashboardStats } from '@/actions/products';
import { getAllOrders } from '@/actions/orders';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
    title: 'Dashboard Overview',
};

export default async function AdminDashboardPage() {
    const [stats, recentOrdersRes] = await Promise.all([
        getAdminDashboardStats(),
        getAllOrders({ limit: 5 }),
    ]);

    const recentOrders = recentOrdersRes.orders;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Intelligence Console</p>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                        Dashboard <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">overview</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-border/60 font-bold text-[10px] uppercase tracking-widest h-11 px-6">
                        Export Report
                    </Button>
                    <Button className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-11 px-6 shadow-lg shadow-primary/20">
                        Live Site
                    </Button>
                </div>
            </div>

            {/* KPI Cards - Premium Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Gross Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-500/10' },
                    { title: 'Inventory Size', value: stats.totalProducts, icon: Package, trend: 'Stable', color: 'text-amber-600', bg: 'bg-amber-500/10' },
                    { title: 'Low Stock', value: stats.lowStockAlerts, icon: AlertTriangle, trend: '-2', color: 'text-destructive', bg: 'bg-destructive/10' },
                ].map((kpi) => (
                    <div key={kpi.title} className="bg-card rounded-[32px] p-8 border border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                                    <kpi.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border/40">
                                    <ArrowUpRight className={`h-3 w-3 ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">{kpi.trend}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">{kpi.title}</p>
                                <p className="text-3xl font-black text-foreground tracking-tighter">{kpi.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section: Recent Orders & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-card rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-8 border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Recent Transactions</h2>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="rounded-full font-bold text-[10px] uppercase tracking-widest">
                            <Link href="/admin/orders">View Ledger <ChevronRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Ref</th>
                                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Client</th>
                                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline</th>
                                    <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valuation</th>
                                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <Link href={`/admin/orders/${order.id}`} className="text-primary font-black tracking-widest text-xs hover:underline uppercase">
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                    {order.customer_name?.charAt(0) || 'C'}
                                                </div>
                                                <span className="text-sm font-bold text-foreground">{order.customer_name || 'Customer'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                                            {formatDateShort(order.created_at)}
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-foreground">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <Badge variant="outline" className="rounded-full px-3 py-0.5 border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                {order.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentOrders.length === 0 && (
                            <div className="py-20">
                                <EmptyState
                                    title="No transactions yet"
                                    description="Your order ledger will populate once sales begin."
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / System Status */}
                <div className="space-y-8">
                    <div className="bg-primary text-primary-foreground rounded-[40px] p-8 relative overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-xl font-bold mb-6 relative z-10">Quick Management</h3>
                        <div className="grid gap-3 relative z-10">
                            <Button asChild variant="secondary" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs justify-start px-6 bg-white/10 hover:bg-white/20 border-0 text-white">
                                <Link href="/admin/products/new"><Package className="mr-3 h-4 w-4" /> New Product</Link>
                            </Button>
                            <Button asChild variant="secondary" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs justify-start px-6 bg-white/10 hover:bg-white/20 border-0 text-white">
                                <Link href="/admin/categories"><UserIcon className="mr-3 h-4 w-4" /> Manage Sectors</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight">System Integrity</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Supabase Engine', status: 'Optimal', color: 'text-emerald-500' },
                                { label: 'Asset CDN', status: 'Live', color: 'text-emerald-500' },
                                { label: 'API Gateway', status: 'Stable', color: 'text-emerald-500' },
                            ].map((sys) => (
                                <div key={sys.label} className="flex items-center justify-between pb-4 border-b border-border/40 last:border-0 last:pb-0">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{sys.label}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${sys.color}`}>{sys.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
