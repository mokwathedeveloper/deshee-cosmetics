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
import { EmptyState } from '@/components/ui/empty-state';
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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Inventory Management</p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
            Catalog <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">products</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl border-border/60 font-bold text-[10px] uppercase tracking-widest h-11 px-6">
            <Link href="/admin/products/import">
              <Download className="h-3.5 w-3.5 mr-2" /> Import
            </Link>
          </Button>
          <Button asChild className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-11 px-6 shadow-lg shadow-primary/20">
            <Link href="/admin/products/new">
              <Plus className="h-3.5 w-3.5 mr-2" /> New Entry
            </Link>
          </Button>
        </div>
      </div>

      {/* Data Table Area */}
      <div className="bg-card rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/40">
          <DataTableToolbar
            searchPlaceholder="Search product ledger..."
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            className="px-0"
          />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingState />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identity</th>
                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sector</th>
                    <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valuation</th>
                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Availability</th>
                    <th className="text-left px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl bg-muted overflow-hidden flex-shrink-0 border border-border/50 group-hover:border-primary/20 transition-colors">
                            <Image
                              src={product.product_images?.[0]?.url || '/images/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground tracking-tight line-clamp-1">{product.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{product.brand || 'No Brand'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {(product as ProductWithImages & { categories?: { name: string } })?.categories?.name || '—'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="font-black text-foreground">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant={product.stock > 0 ? "outline" : "destructive"} className="rounded-full px-3 py-0.5 border-border/60 text-[10px] font-bold uppercase tracking-widest">
                          {product.stock > 0 ? `${product.stock} units` : 'Zero Stock'}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest ${product.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteId(product.id)}
                            className="rounded-full h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-20">
                  <EmptyState
                    title="No products listed"
                    description="Your inventory ledger is currently empty."
                  />
                </div>
              )}
            </div>

            <div className="p-8 border-t border-border/40">
              <DataTablePagination
                currentPage={page}
                totalItems={totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
                itemLabel="products"
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Record"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
