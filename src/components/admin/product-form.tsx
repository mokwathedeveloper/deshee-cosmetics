'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct, updateProduct } from '@/actions/products';
import { createClient } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/utils';
import type { Category, Product } from '@/types/database';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ProductFormProps {
    product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: product?.name || '',
        slug: product?.slug || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        compare_at_price: product?.compare_at_price?.toString() || '',
        stock: product?.stock?.toString() || '0',
        sku: product?.sku || '',
        brand: product?.brand || '',
        status: product?.status || 'active',
        category_id: product?.category_id || '',
    });

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            const { data } = await supabase.from('categories').select('*').order('name');
            setCategories((data || []) as Category[]);
        }
        fetchCategories();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'name' && !product ? { slug: generateSlug(value) } : {}),
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            price: parseFloat(formData.price),
            compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
            stock: parseInt(formData.stock),
            sku: formData.sku || null,
            brand: formData.brand || null,
            status: formData.status as 'active' | 'inactive',
            category_id: formData.category_id || null,
        };

        const result = product
            ? await updateProduct(product.id, payload)
            : await createProduct(payload);

        setLoading(false);

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
            <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {product ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-5 max-w-2xl">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="mt-1" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="price">Price *</Label>
                        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="compare_at_price">Compare at Price</Label>
                        <Input id="compare_at_price" name="compare_at_price" type="number" step="0.01" value={formData.compare_at_price} onChange={handleChange} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required className="mt-1" />
                    </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="category_id">Category</Label>
                        <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500">
                            <option value="">No category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="bg-pink-500 hover:bg-pink-600">
                        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
