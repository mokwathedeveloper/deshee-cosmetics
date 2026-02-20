'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataTableToolbar, DataTablePagination } from '@/components/admin/data-table';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import type { OrderWithItems } from '@/types/database';
import { ChevronDown, Search, Filter, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(search);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const supabase = createClient();
            const offset = (page - 1) * ITEMS_PER_PAGE;

            let query = supabase
                .from('orders')
                .select('*, order_items(*)', { count: 'exact' });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            if (debouncedSearch) {
                query = query.or(
                    `order_number.ilike.%${debouncedSearch}%,customer_name.ilike.%${debouncedSearch}%`
                );
            }

            query = query.order('created_at', { ascending: false }).range(offset, offset + ITEMS_PER_PAGE - 1);

            const { data, count } = await query;
            setOrders((data || []) as OrderWithItems[]);
            setTotalCount(count || 0);
            setLoading(false);
        }
        fetchOrders();
    }, [page, debouncedSearch, statusFilter]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Transaction Ledger</p>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                        Orders <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">history</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-border/60 font-bold text-[10px] uppercase tracking-widest h-11 px-6">
                        Download Manifest
                    </Button>
                </div>
            </div>

            {/* Data Table Area */}
            <div className="bg-card rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border/40 bg-muted/10">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-12 pr-4 h-12 rounded-2xl bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="relative group min-w-[200px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="appearance-none w-full pl-12 pr-10 h-12 rounded-2xl bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all text-[11px] font-bold uppercase tracking-widest"
                            >
                                <option value="all">Global Status</option>
                                <option value="new">New</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingState />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/30">
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Client Detail</th>
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timestamp</th>
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manifest</th>
                                        <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valuation</th>
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-muted/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <Link href={`/admin/orders/${order.id}`} className="text-primary font-black tracking-widest text-xs hover:underline uppercase">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-sm text-foreground tracking-tight">{order.customer_name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{order.customer_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                {formatDateShort(order.created_at)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground font-black text-[10px] uppercase tracking-widest">
                                                    <ShoppingBag className="h-3 w-3" />
                                                    {order.order_items?.length || 0} Units
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-foreground">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                                                    ['delivered', 'shipped'].includes(order.status) ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-muted/50 border-border text-muted-foreground'
                                                }`}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && (
                                <div className="py-20">
                                    <EmptyState
                                        title="No orders located"
                                        description="Your order database is currently clear of matches."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-border/40">
                            <DataTablePagination
                                currentPage={page}
                                totalItems={totalCount}
                                itemsPerPage={ITEMS_PER_PAGE}
                                itemLabel="orders"
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
