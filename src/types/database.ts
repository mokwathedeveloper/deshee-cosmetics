export type Profile = {
    id: string;
    full_name: string | null;
    phone: string | null;
    role: 'customer' | 'admin';
    created_at: string;
};

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_featured: boolean;
    sort_order: number;
    created_at: string;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    stock: number;
    sku: string | null;
    status: 'active' | 'inactive';
    brand: string | null;
    category_id: string | null;
    rating: number;
    rating_count: number;
    created_at: string;
    updated_at: string;
};

export type ProductWithImages = Product & {
    product_images: ProductImage[];
    categories?: Category | null;
};

export type ProductImage = {
    id: string;
    product_id: string;
    url: string;
    alt: string | null;
    sort_order: number;
};

export type Order = {
    id: string;
    user_id: string | null;
    order_number: string;
    status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    total: number;
    currency: string;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    notes: string | null;
    created_at: string;
};

export type OrderWithItems = Order & {
    order_items: OrderItem[];
};

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string | null;
    name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
};

export type CartItem = {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    image_url: string;
    quantity: number;
    stock: number;
};
