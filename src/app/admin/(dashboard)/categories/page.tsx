'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories';
import { generateSlug } from '@/lib/utils';
import type { Category } from '@/types/database';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_featured: false,
        sort_order: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase.from('categories').select('*').order('sort_order');
        setCategories((data || []) as Category[]);
        setLoading(false);
    }

    function openCreateDialog() {
        setEditing(null);
        setFormData({ name: '', slug: '', description: '', image_url: '', is_featured: false, sort_order: 0 });
        setDialogOpen(true);
    }

    function openEditDialog(category: Category) {
        setEditing(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image_url: category.image_url || '',
            is_featured: category.is_featured,
            sort_order: category.sort_order,
        });
        setDialogOpen(true);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            ...(name === 'name' && !editing ? { slug: generateSlug(value) } : {}),
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            image_url: formData.image_url || null,
            is_featured: formData.is_featured,
            sort_order: Number(formData.sort_order),
        };

        const result = editing
            ? await updateCategory(editing.id, payload)
            : await createCategory(payload);

        setSaving(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(editing ? 'Category updated' : 'Category created');
        setDialogOpen(false);
        fetchCategories();
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        const result = await deleteCategory(deleteId);
        setDeleting(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Category deleted');
            setCategories((prev) => prev.filter((c) => c.id !== deleteId));
        }
        setDeleteId(null);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Button onClick={openCreateDialog} className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
            </div>

            {loading ? (
                <LoadingState />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">/{cat.slug}</p>
                                    {cat.description && (
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{cat.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3">
                                        {cat.is_featured && (
                                            <span className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded font-medium">Featured</span>
                                        )}
                                        <span className="text-xs text-muted-foreground">Order: {cat.sort_order}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(cat)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="col-span-full text-center py-12 text-muted-foreground">No categories yet</p>
                    )}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500" />
                        </div>
                        <div>
                            <Label htmlFor="image_url">Image URL</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sort_order">Sort Order</Label>
                                <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} className="mt-1" />
                            </div>
                            <div className="flex items-center gap-2 mt-6">
                                <input id="is_featured" name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} className="rounded" />
                                <Label htmlFor="is_featured">Featured</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving} className="bg-pink-500 hover:bg-pink-600">
                                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete Category"
                description="Are you sure? Products in this category will become uncategorized."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
