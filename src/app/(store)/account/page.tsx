import { getSession, signOut } from '@/actions/auth';
import { getMyOrders } from '@/actions/orders';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    User, 
    Package, 
    Settings, 
    LogOut, 
    ShoppingBag, 
    ChevronRight,
    Clock,
    CreditCard
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function AccountPage() {
    const session = await getSession();
    if (!session) redirect('/auth/login?returnUrl=/account');

    const orders = await getMyOrders();

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Member Dashboard</p>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
                            Welcome back, <span className="text-primary italic font-serif font-normal">{session.profile?.full_name?.split(' ')[0] || 'Member'}</span>.
                        </h1>
                    </div>
                    <form action={signOut}>
                        <Button variant="outline" type="submit" className="rounded-full px-6 h-12 font-bold uppercase tracking-widest text-[10px] border-border/60 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">
                            <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
                        </Button>
                    </form>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Profile & Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-muted/30 rounded-[32px] p-8 border border-border/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                                        <User className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">Profile Detail</h2>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Personal Account</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Full Name</p>
                                        <p className="font-bold text-foreground">{session.profile?.full_name || 'Not provided'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Email Address</p>
                                        <p className="font-bold text-foreground">{session.user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Phone</p>
                                        <p className="font-bold text-foreground">{session.profile?.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                <Button variant="secondary" className="w-full rounded-2xl h-12 font-bold text-xs uppercase tracking-widest mt-4">
                                    <Settings className="mr-2 h-3.5 w-3.5" /> Edit Profile
                                </Button>
                            </div>
                        </section>

                        {/* Quick Stats/Badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/20 p-6 rounded-3xl border border-border/40 text-center">
                                <Package className="h-6 w-6 text-primary mx-auto mb-3 opacity-40" />
                                <p className="text-2xl font-black text-foreground">{orders.length}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Orders</p>
                            </div>
                            <div className="bg-muted/20 p-6 rounded-3xl border border-border/40 text-center">
                                <CreditCard className="h-6 w-6 text-primary mx-auto mb-3 opacity-40" />
                                <p className="text-2xl font-black text-foreground">Elite</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Status</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                                Browse Collection
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border/60">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                                <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">Discover something you love in our collection and bring it home today.</p>
                                <Button asChild className="rounded-full px-10 h-14 font-bold uppercase tracking-widest text-xs">
                                    <Link href="/shop">Start Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/account/orders/${order.id}`}
                                        className="group block p-6 md:p-8 bg-card rounded-[32px] border border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{order.order_number}</p>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{formatDateShort(order.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-10">
                                                <div className="text-left md:text-right">
                                                    <p className="text-xl font-black text-foreground tracking-tighter">{formatCurrency(order.total)}</p>
                                                    <Badge variant="outline" className="mt-2 rounded-full px-3 py-0.5 border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                    <ChevronRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
