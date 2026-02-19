'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { updateOrderStatus } from '@/actions/orders';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import type { OrderWithItems } from '@/types/database';
import { toast } from 'sonner';

const statuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<OrderWithItems | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchOrder() {
            const supabase = createClient();
            const { data } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('id', id)
                .single();
            setOrder(data as OrderWithItems);
            setLoading(false);
        }
        fetchOrder();
    }, [id]);

    async function handleStatusChange(status: string) {
        setUpdating(true);
        const result = await updateOrderStatus(id, status);
        setUpdating(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        setOrder((prev) => prev ? { ...prev, status: status as OrderWithItems['status'] } : prev);
        toast.success(`Status updated to ${status}`);
    }

    if (loading) return <LoadingState />;
    if (!order) return <p className="text-center py-20 text-muted-foreground">Order not found</p>;

    return (
        <div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Orders
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">Product</th>
                                    <th className="text-right px-4 py-3 font-medium">Price</th>
                                    <th className="text-right px-4 py-3 font-medium">Qty</th>
                                    <th className="text-right px-4 py-3 font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {order.order_items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">{item.name}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.line_total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span>Shipping</span><span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t">
                                <span>Total</span><span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="bg-white border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Customer</h3>
                        <div className="text-sm space-y-1 text-gray-600">
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <p>{order.customer_email}</p>
                            {order.customer_phone && <p>{order.customer_phone}</p>}
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Shipping Address</h3>
                        <div className="text-sm text-gray-600">
                            <p>{order.shipping_address}</p>
                            <p>{order.shipping_city}</p>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="bg-white border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {statuses.map((s) => (
                                <Button
                                    key={s}
                                    variant={order.status === s ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={updating || order.status === s}
                                    onClick={() => handleStatusChange(s)}
                                    className={order.status === s ? 'bg-pink-500 hover:bg-pink-600' : ''}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-white border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
