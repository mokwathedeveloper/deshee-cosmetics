'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableToolbar, DataTablePagination } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { deleteProduct } from '@/actions/products';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency } from '@/lib/utils';
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
      toast.success('Product deleted successfully');
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setTotalCount((prev) => prev - 1);
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/import">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTableToolbar
            searchPlaceholder="Search products..."
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            className="px-6"
          />

          {loading ? (
            <LoadingState />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left px-6 py-4 font-medium text-sm">Product</th>
                      <th className="text-left px-6 py-4 font-medium text-sm">Category</th>
                      <th className="text-right px-6 py-4 font-medium text-sm">Price</th>
                      <th className="text-left px-6 py-4 font-medium text-sm">Stock</th>
                      <th className="text-left px-6 py-4 font-medium text-sm">Status</th>
                      <th className="text-right px-6 py-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <Image
                                src={product.product_images?.[0]?.url || '/images/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              {product.brand && (
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {(product as ProductWithImages & { categories?: { name: string } })?.categories?.name || '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium">{formatCurrency(product.price)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={product.status === 'active' ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteId(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

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
