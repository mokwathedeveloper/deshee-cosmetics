'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataTableToolbar, DataTablePagination } from '@/components/admin/data-table';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency, formatDateShort, getStatusColor } from '@/lib/utils';
import type { OrderWithItems } from '@/types/database';

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
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

            <div className="bg-white border rounded-lg p-4">
                <DataTableToolbar
                    searchPlaceholder="Search by order # or customer..."
                    searchValue={search}
                    onSearchChange={(v) => { setSearch(v); setPage(1); }}
                    filterElement={
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="new">New</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    }
                />

                {loading ? (
                    <LoadingState />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium">Order</th>
                                        <th className="text-left px-4 py-3 font-medium">Customer</th>
                                        <th className="text-left px-4 py-3 font-medium">Date</th>
                                        <th className="text-left px-4 py-3 font-medium">Items</th>
                                        <th className="text-right px-4 py-3 font-medium">Total</th>
                                        <th className="text-left px-4 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <Link href={`/admin/orders/${order.id}`} className="text-pink-500 hover:text-pink-600 font-medium">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{order.customer_name}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{formatDateShort(order.created_at)}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.order_items?.length || 0}</td>
                                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <DataTablePagination
                            currentPage={page}
                            totalItems={totalCount}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemLabel="orders"
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
