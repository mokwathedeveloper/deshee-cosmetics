'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableToolbar, DataTablePagination } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PriceTag } from '@/components/ui/price-tag';
import { StockBadge } from '@/components/ui/stock-badge';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { deleteProduct } from '@/actions/products';
import { useDebounce } from '@/hooks/use-debounce';
import type { ProductWithImages } from '@/types/database';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductWithImages[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const debouncedSearch = useDebounce(search);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const supabase = createClient();
            const offset = (page - 1) * ITEMS_PER_PAGE;

            let query = supabase
                .from('products')
                .select('*, product_images(*), categories(*)', { count: 'exact' });

            if (debouncedSearch) {
                query = query.ilike('name', `%${debouncedSearch}%`);
            }

            query = query.order('created_at', { ascending: false }).range(offset, offset + ITEMS_PER_PAGE - 1);

            const { data, count } = await query;
            setProducts((data || []) as ProductWithImages[]);
            setTotalCount(count || 0);
            setLoading(false);
        }
        fetchProducts();
    }, [page, debouncedSearch]);

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        const result = await deleteProduct(deleteId);
        setDeleting(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Product deleted');
            setProducts((prev) => prev.filter((p) => p.id !== deleteId));
            setTotalCount((prev) => prev - 1);
        }
        setDeleteId(null);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="flex items-center gap-2">
                    <Link href="/admin/products/import">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" /> Import
                        </Button>
                    </Link>
                    <Link href="/admin/products/new">
                        <Button className="bg-pink-500 hover:bg-pink-600">
                            <Plus className="h-4 w-4 mr-2" /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
                <DataTableToolbar
                    searchPlaceholder="Search products..."
                    searchValue={search}
                    onSearchChange={(v) => { setSearch(v); setPage(1); }}
                />

                {loading ? (
                    <LoadingState />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium">Product</th>
                                        <th className="text-left px-4 py-3 font-medium">Category</th>
                                        <th className="text-right px-4 py-3 font-medium">Price</th>
                                        <th className="text-left px-4 py-3 font-medium">Stock</th>
                                        <th className="text-left px-4 py-3 font-medium">Status</th>
                                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={product.product_images?.[0]?.url || '/images/placeholder.jpg'}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                    <span className="font-medium">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {(product as ProductWithImages & { categories?: { name: string } })?.categories?.name || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <PriceTag price={product.price} size="sm" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <StockBadge stock={product.stock} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(product.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <DataTablePagination
                            currentPage={page}
                            totalItems={totalCount}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemLabel="products"
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
