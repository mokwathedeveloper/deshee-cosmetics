'use server';

import { createClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';
import type { CartItem, OrderWithItems } from '@/types/database';

export async function createOrder(
    checkoutData: {
        customer_name: string;
        customer_email: string;
        customer_phone?: string;
        shipping_address: string;
        shipping_city: string;
        notes?: string;
    },
    cartItems: CartItem[]
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'You must be logged in to place an order.' };
    if (cartItems.length === 0) return { error: 'Cart is empty.' };

    // Check stock availability
    for (const item of cartItems) {
        const { data: product } = await supabase
            .from('products')
            .select('stock, name')
            .eq('id', item.id)
            .single();

        if (!product || product.stock < item.quantity) {
            return {
                error: `Insufficient stock for "${product?.name || item.name}". Available: ${product?.stock || 0}`,
            };
        }
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal;

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            order_number: generateOrderNumber(),
            status: 'new',
            subtotal,
            total,
            customer_name: checkoutData.customer_name,
            customer_email: checkoutData.customer_email,
            customer_phone: checkoutData.customer_phone || null,
            shipping_address: checkoutData.shipping_address,
            shipping_city: checkoutData.shipping_city,
            notes: checkoutData.notes || null,
        })
        .select()
        .single();

    if (orderError) return { error: orderError.message };

    // Create order items
    const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) return { error: itemsError.message };

    // Reduce stock
    for (const item of cartItems) {
        await supabase.rpc('decrement_stock', {
            product_id: item.id,
            qty: item.quantity,
        });
        // Fallback: direct update if RPC not available
        const { data: prod } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();
        if (prod) {
            await supabase
                .from('products')
                .update({ stock: prod.stock - item.quantity })
                .eq('id', item.id);
        }
    }

    return { order };
}

export async function getMyOrders() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return (data || []) as OrderWithItems[];
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return data as OrderWithItems;
}

export async function getAllOrders(options?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    const supabase = await createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' });

    if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
    }

    if (options?.search) {
        query = query.or(
            `order_number.ilike.%${options.search}%,customer_name.ilike.%${options.search}%,customer_email.ilike.%${options.search}%`
        );
    }

    query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching all orders:', error);
        return { orders: [] as OrderWithItems[], count: 0 };
    }

    return {
        orders: (data || []) as OrderWithItems[],
        count: count || 0,
    };
}

export async function updateOrderStatus(id: string, status: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}
