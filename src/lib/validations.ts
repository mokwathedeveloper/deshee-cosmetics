import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
});

export const productSchema = z.object({
    name: z.string().min(2, 'Product name is required'),
    slug: z.string().min(2, 'Slug is required'),
    description: z.string().optional(),
    price: z.coerce.number().positive('Price must be positive'),
    compare_at_price: z.coerce.number().positive().optional().nullable(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    sku: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    brand: z.string().optional(),
    category_id: z.string().uuid().optional().nullable(),
});

export const categorySchema = z.object({
    name: z.string().min(2, 'Category name is required'),
    slug: z.string().min(2, 'Slug is required'),
    description: z.string().optional(),
    image_url: z.string().optional(),
    is_featured: z.boolean().default(false),
    sort_order: z.coerce.number().int().min(0).default(0),
});

export const checkoutSchema = z.object({
    customer_name: z.string().min(2, 'Name is required'),
    customer_email: z.string().email('Valid email is required'),
    customer_phone: z.string().optional(),
    shipping_address: z.string().min(5, 'Address is required'),
    shipping_city: z.string().min(2, 'City is required'),
    notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
