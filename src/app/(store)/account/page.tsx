import { getSession } from '@/actions/auth';
import { getMyOrders } from '@/actions/orders';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateShort, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function AccountPage() {
    const session = await getSession();
    if (!session) redirect('/auth/login?returnUrl=/account');

    const orders = await getMyOrders();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <form action={signOut}>
                    <Button variant="outline" type="submit">Sign Out</Button>
                </form>
            </div>

            {/* Profile */}
            <div className="bg-white border rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Profile</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Name</span>
                        <p className="font-medium">{session.profile?.full_name || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{session.user.email}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Phone</span>
                        <p className="font-medium">{session.profile?.phone || 'Not set'}</p>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Order History</h2>
                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
                        <Link href="/shop">
                            <Button className="bg-pink-500 hover:bg-pink-600">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block border rounded-lg p-4 hover:border-pink-300 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">{order.order_number}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{formatDateShort(order.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
