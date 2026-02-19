'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProduct, updateProduct } from '@/actions/products';
import { createClient } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/utils';
import type { Category, Product } from '@/types/database';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
    description: z.string().optional(),
    price: z.coerce.number().positive({ message: "Price must be a positive number." }),
    compare_at_price: z.coerce.number().positive().optional().nullable(),
    stock: z.coerce.number().int().min(0, { message: "Stock can't be negative." }),
    sku: z.string().optional(),
    brand: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    category_id: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name || '',
            slug: product?.slug || '',
            description: product?.description || '',
            price: product?.price || 0,
            compare_at_price: product?.compare_at_price || null,
            stock: product?.stock || 0,
            sku: product?.sku || '',
            brand: product?.brand || '',
            status: product?.status || 'active',
            category_id: product?.category_id || '',
        },
    });
    
    const { formState, watch } = form;
    const watchedName = watch('name');

    useEffect(() => {
        if (!product && watchedName) {
            form.setValue('slug', generateSlug(watchedName), { shouldValidate: true });
        }
    }, [watchedName, product, form]);

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data } = await supabase.from('categories').select('*').order('name');
            setCategories((data || []) as Category[]);
        }
        fetchCategories();
    }, []);

    async function onSubmit(values: ProductFormValues) {
        const payload = { ...values };

        const result = product
            ? await updateProduct(product.id, payload)
            : await createProduct(payload);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(product ? 'Product updated' : 'Product created');
        router.push('/admin/products');
        router.refresh();
    }

    return (
        <div>
            <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-6">
                {product ? 'Edit Product' : 'Add New Product'}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border rounded-lg p-6 space-y-5 max-w-2xl">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price *</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="compare_at_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compare at Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock *</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">No category</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={formState.isSubmitting} className="bg-primary hover:bg-primary/90">
                            {formState.isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </Button>
                        <Link href="/admin/products">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
