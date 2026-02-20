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
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
    description: z.string().optional(),
    price: z.number().positive({ message: "Price must be a positive number." }),
    compare_at_price: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0, { message: "Stock can't be negative." }),
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

        toast.success(product ? 'Product record updated' : 'New product registered');
        router.push('/admin/products');
        router.refresh();
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="space-y-6">
                <Button asChild variant="ghost" className="rounded-full px-4 -ml-4 text-muted-foreground hover:text-primary transition-all">
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Ledger Overview
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Catalog Management</p>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                            {product ? 'Edit' : 'Register'} <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">product</span>
                        </h1>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Main Identity Card */}
                        <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary relative z-10">Product Identity</h3>
                            
                            <div className="space-y-5 relative z-10">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Market Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="e.g. Ultra Hydrating Serum" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">System Identifier (Slug)</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="ultra-hydrating-serum" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Manufacturer / Brand</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="e.g. Cerave" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Valuation & Inventory Card */}
                        <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Commercials</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Retail Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 font-black" onChange={e => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="compare_at_price"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Market Valuation</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} value={field.value ?? ''} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 opacity-60" onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)} />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Inventory Count</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 font-bold" onChange={e => field.onChange(parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Stock Keeping Unit</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 font-mono text-xs uppercase" placeholder="SKU-000" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Narrative & Categorization */}
                        <div className="md:col-span-8 bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Content & Classification</h3>
                            
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Product Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={6} className="rounded-[24px] bg-muted/30 border-border/50 focus:ring-primary/20 leading-relaxed p-5" placeholder="Elaborate on product features and benefits..." />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="md:col-span-4 space-y-8">
                            <div className="bg-card rounded-[40px] border border-border/50 p-8 space-y-6 shadow-sm relative overflow-hidden">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Status & Taxonomy</h3>
                                
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Sector Assignment</FormLabel>
                                             <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 text-xs font-bold uppercase tracking-widest">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectItem value="" className="text-[10px] font-bold uppercase tracking-widest">Unassigned</SelectItem>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id} className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Operational State</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20 text-xs font-bold uppercase tracking-widest">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectItem value="active" className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Active</SelectItem>
                                                    <SelectItem value="inactive" className="text-[10px] font-bold uppercase tracking-widest text-destructive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submission Panel */}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" disabled={formState.isSubmitting} className="w-full h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0">
                                    {formState.isSubmitting ? 'Syncing...' : product ? 'Commit Changes' : 'Initialize Record'}
                                </Button>
                                <Button asChild variant="ghost" className="w-full h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <Link href="/admin/products">Discard Changes</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
