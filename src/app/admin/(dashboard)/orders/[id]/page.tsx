'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Calendar, User, Truck, CreditCard, ClipboardList, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { updateOrderStatus } from '@/actions/orders';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderWithItems } from '@/types/database';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
        toast.success(`Operational status updated to ${status}`);
    }

    if (loading) return (
        <div className="py-20 flex justify-center">
            <LoadingState />
        </div>
    );
    
    if (!order) return (
        <div className="py-20 text-center">
            <p className="text-xl font-bold text-muted-foreground">Order record not found</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/admin/orders">Return to Ledger</Link>
            </Button>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="space-y-6">
                <Button asChild variant="ghost" className="rounded-full px-4 -ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/admin/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Ledger Overview
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-full px-3 py-0.5">
                                {order.status}
                            </Badge>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Internal Record</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                            {order.order_number}
                        </h1>
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 opacity-40" />
                                <span>{formatDate(order.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 h-12 border-border/60">
                            Print Invoice
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Items & Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-border/40 bg-muted/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Manifest</h2>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/30">
                                        <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product Detail</th>
                                        <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unit Price</th>
                                        <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</th>
                                        <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Extended</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {order.order_items.map((item) => (
                                        <tr key={item.id} className="group">
                                            <td className="px-8 py-5">
                                                <p className="font-bold text-sm text-foreground tracking-tight">{item.name}</p>
                                            </td>
                                            <td className="px-8 py-5 text-right font-medium text-muted-foreground text-sm">
                                                {formatCurrency(item.unit_price)}
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-foreground text-sm">
                                                {item.quantity}
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-foreground text-sm">
                                                {formatCurrency(item.line_total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-8 bg-muted/10 border-t border-border/40">
                            <div className="max-w-xs ml-auto space-y-3">
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Separator className="my-4 bg-border/40" />
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-widest text-foreground">Final Total</span>
                                    <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Controls */}
                    <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Operational Status</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {statuses.map((s) => (
                                <Button
                                    key={s}
                                    variant={order.status === s ? 'default' : 'outline'}
                                    disabled={updating || order.status === s}
                                    onClick={() => handleStatusChange(s)}
                                    className={`rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest transition-all ${
                                        order.status === s 
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                            : 'border-border/60 hover:bg-primary/5 hover:text-primary'
                                    }`}
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Logistics */}
                <div className="space-y-8">
                    {/* Customer Identity */}
                    <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg tracking-tight uppercase">Customer</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Full Name</p>
                                <p className="font-bold text-foreground">{order.customer_name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Communication</p>
                                <p className="font-medium text-foreground">{order.customer_email}</p>
                                {order.customer_phone && <p className="font-medium text-foreground">{order.customer_phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg tracking-tight uppercase">Logistics</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Destination</p>
                            <p className="font-medium text-foreground leading-relaxed">
                                {order.shipping_address}<br />
                                {order.shipping_city}, Kenya
                            </p>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    {order.notes && (
                        <div className="bg-muted/30 rounded-[40px] border border-border/50 p-8 space-y-4 border-dashed">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Client Instructions</h3>
                            <p className="text-sm font-medium text-foreground leading-relaxed italic">&ldquo;{order.notes}&rdquo;</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
