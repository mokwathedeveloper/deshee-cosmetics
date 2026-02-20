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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';

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

        toast.success(editing ? 'Sector details updated' : 'New sector established');
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
            toast.success('Sector removed from registry');
            setCategories((prev) => prev.filter((c) => c.id !== deleteId));
        }
        setDeleteId(null);
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Organizational Hierarchy</p>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                        Sectors <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">categories</span>
                    </h1>
                </div>
                <Button onClick={openCreateDialog} className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-11 px-6 shadow-lg shadow-primary/20">
                    <Plus className="h-3.5 w-3.5 mr-2" /> New Category
                </Button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <LoadingState />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="group bg-card rounded-[32px] p-8 border border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors uppercase">{cat.name}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">ID: {cat.slug}</p>
                                        </div>
                                        <div className="flex gap-1 translate-x-2 -translate-y-2">
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5" onClick={() => openEditDialog(cat)}>
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => setDeleteId(cat.id)}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {cat.description && (
                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2 mb-6">{cat.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                                    {cat.is_featured && (
                                        <Badge className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-0.5">Featured</Badge>
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-auto">Sequence: {cat.sort_order}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full py-20">
                            <EmptyState
                                title="No sectors defined"
                                description="Your category registry is currently awaiting initialization."
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="rounded-[40px] p-8 max-w-xl">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">{editing ? 'Modify Sector' : 'Register Sector'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="e.g. Skincare" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Registry Slug</Label>
                                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="skincare" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Brief Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="Describe this sector..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Visual Asset URL</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" placeholder="https://..." />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="sort_order" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Display Priority</Label>
                                <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" />
                            </div>
                            <div className="flex items-center gap-3 mt-8 ml-2">
                                <input id="is_featured" name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded-lg border-border/50 text-primary focus:ring-primary/20" />
                                <Label htmlFor="is_featured" className="text-[10px] font-bold uppercase tracking-widest">Mark as Featured</Label>
                            </div>
                        </div>

                        <DialogFooter className="mt-8 gap-3 sm:gap-0">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-12 px-6">Cancel</Button>
                            <Button type="submit" disabled={saving} className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-12 px-10 shadow-lg shadow-primary/20">
                                {saving ? 'Syncing...' : editing ? 'Commit Changes' : 'Initialize Sector'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Decommission Sector"
                description="Are you sure? Products in this sector will be disconnected from the hierarchy."
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
