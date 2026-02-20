import { getOrderById } from '@/actions/orders';
import { getSession } from '@/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Details',
};

interface Props {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <div className="container py-12 md:py-20 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-10">
                <Button asChild variant="ghost" className="rounded-full px-4 -ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/account">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Account
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-full px-3 py-0.5">
                                {order.status}
                            </Badge>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Order Tracking</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                            {order.order_number}
                        </h1>
                        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 opacity-40" />
                                <span>{formatDate(order.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-12 border-border/60">
                            Download Invoice
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Items List */}
                        <div className="bg-card rounded-[32px] border border-border/50 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-border/40 bg-muted/20">
                                <h3 className="font-bold uppercase tracking-[0.2em] text-[11px] text-muted-foreground">Purchased Items</h3>
                            </div>
                            <div className="divide-y divide-border/40">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="p-6 md:p-8 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                                                <Package className="h-6 w-6 opacity-30" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-lg tracking-tight leading-tight mb-1">{item.name}</p>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    Qty: {item.quantity} <span className="mx-2 opacity-30">|</span> {formatCurrency(item.unit_price)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-black text-foreground">{formatCurrency(item.line_total)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline Placeholder */}
                        <div className="bg-muted/30 rounded-[32px] p-8 border border-border/40">
                            <h3 className="font-bold text-lg mb-6">Delivery Timeline</h3>
                            <div className="space-y-6">
                                {[
                                    { status: 'Order Placed', date: formatDate(order.created_at), done: true },
                                    { status: 'Processing', date: 'Updating soon', done: order.status !== 'new' },
                                    { status: 'Shipped', date: 'Updating soon', done: ['shipped', 'delivered'].includes(order.status) },
                                    { status: 'Delivered', date: 'Updating soon', done: order.status === 'delivered' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i < 3 && <div className={`absolute left-[11px] top-6 bottom-[-24px] w-0.5 ${step.done ? 'bg-primary' : 'bg-border/40'}`} />}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border/60 text-muted-foreground'}`}>
                                            <div className="w-2 h-2 rounded-full bg-current" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.status}</p>
                                            <p className="text-xs font-medium text-muted-foreground opacity-60">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary */}
                        <div className="bg-muted/30 rounded-[32px] p-8 border border-border/40 space-y-6">
                            <h3 className="font-bold text-lg">Order Summary</h3>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">Free</span>
                                </div>
                                <Separator className="bg-border/40" />
                                <div className="flex justify-between items-end pt-2">
                                    <span className="font-bold">Total</span>
                                    <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="bg-card rounded-[32px] p-8 border border-border/50 space-y-8 shadow-xl shadow-primary/5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Truck className="h-5 w-5" />
                                    <h4 className="font-bold uppercase tracking-widest text-xs">Shipping Address</h4>
                                </div>
                                <div className="text-sm font-medium text-muted-foreground space-y-1 leading-relaxed">
                                    <p className="text-foreground font-bold">{order.customer_name}</p>
                                    <p>{order.shipping_address}</p>
                                    <p>{order.shipping_city}, Kenya</p>
                                    <p>{order.customer_phone}</p>
                                </div>
                            </div>

                            <Separator className="bg-border/40" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <CreditCard className="h-5 w-5" />
                                    <h4 className="font-bold uppercase tracking-widest text-xs">Payment Method</h4>
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    <p className="text-foreground font-bold">Cash on Delivery</p>
                                    <p>Safe and secure payment upon arrival.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
