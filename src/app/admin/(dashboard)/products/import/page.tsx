'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    Check,
    Search,
    Loader2,
    Package,
    Star,
    Trash2,
    RefreshCw,
    AlertTriangle,
    Edit3,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    fetchExternalProducts,
    importProduct,
    checkImportedSkus,
} from '@/actions/import-products';
import { fullDatabaseReset } from '@/actions/admin-setup';
import { getCategories } from '@/actions/categories';
import type { Category } from '@/types/database';
import { toast } from 'sonner';
import {
    curatedProducts,
    CURATED_CATEGORIES,
    type CuratedProduct,
} from '@/data/curated-products';

// Types (can't import from 'use server' files)
type ExternalProduct = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    sku: string;
    thumbnail: string;
    images: string[];
    tags: string[];
};

const API_CATEGORIES = [
    { key: 'lipstick', label: '💄 Lipstick' },
    { key: 'foundation', label: '🧴 Foundation' },
    { key: 'mascara', label: '👁️ Mascara' },
    { key: 'eyeshadow', label: '🎨 Eyeshadow' },
    { key: 'blush', label: '🌸 Blush' },
    { key: 'nail_polish', label: '💅 Nail Polish' },
];

type SourceTab = 'curated' | 'api';

export default function ImportProductsPage() {
    // State
    const [sourceTab, setSourceTab] = useState<SourceTab>('curated');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [apiCategory, setApiCategory] = useState<string>(API_CATEGORIES[0].key);
    const [products, setProducts] = useState<ExternalProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [importedSkus, setImportedSkus] = useState<Set<string>>(new Set());
    const [importingSkus, setImportingSkus] = useState<Set<string>>(new Set());
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [total, setTotal] = useState(0);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [resetting, setResetting] = useState(false);
    // Custom price overrides (key = product sku/id)
    const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

    // Load categories
    const loadCategories = useCallback(async () => {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(cats[0].id);
        }
    }, [selectedCategoryId]);

    useEffect(() => { loadCategories(); }, [loadCategories]);

    // Get filtered curated products
    const getFilteredCurated = useCallback((): CuratedProduct[] => {
        let filtered = curatedProducts;
        if (activeCategory !== 'all') {
            filtered = filtered.filter((p) => p.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q)),
            );
        }
        return filtered;
    }, [activeCategory, search]);

    // Load API products
    const loadApiProducts = useCallback(async () => {
        setLoading(true);
        const result = await fetchExternalProducts(apiCategory, search || undefined, 1, 30);
        setProducts(result.products);
        setTotal(result.total);
        if (result.products.length > 0) {
            const skus = result.products.map((p) => p.sku).filter(Boolean);
            if (skus.length > 0) {
                const existing = await checkImportedSkus(skus);
                setImportedSkus(new Set(existing));
            }
        }
        setLoading(false);
    }, [apiCategory, search]);

    useEffect(() => {
        if (sourceTab === 'api') {
            const timer = setTimeout(loadApiProducts, 300);
            return () => clearTimeout(timer);
        }
    }, [sourceTab, loadApiProducts]);

    // Check curated SKUs on mount
    useEffect(() => {
        const checkCurated = async () => {
            const skus = curatedProducts.map((p) => p.id);
            if (skus.length > 0) {
                const existing = await checkImportedSkus(skus);
                setImportedSkus(new Set(existing));
            }
        };
        checkCurated();
    }, []);

    // Import a curated product
    async function handleImportCurated(product: CuratedProduct) {
        if (!selectedCategoryId) {
            toast.error('Please select a store category first.');
            return;
        }
        setImportingSkus((prev) => new Set(prev).add(product.id));

        const price = customPrices[product.id] ?? product.suggestedPrice;
        const ext: ExternalProduct = {
            id: parseInt(product.id.replace(/\D/g, '')) || Math.floor(Math.random() * 100000),
            title: product.name,
            description: product.description,
            category: product.category,
            price: price,
            discountPercentage: 0,
            rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
            stock: Math.floor(Math.random() * 200) + 30,
            brand: product.brand,
            sku: product.id,
            thumbnail: product.image,
            images: [product.image],
            tags: product.tags,
        };

        const result = await importProduct(ext, selectedCategoryId);
        if (result.error) {
            toast.error(`Failed: ${result.error}`);
        } else {
            toast.success(`Imported "${product.name}" at KES ${price}`);
            setImportedSkus((prev) => new Set(prev).add(product.id));
        }
        setImportingSkus((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
        });
    }

    // Import an API product
    async function handleImportApi(product: ExternalProduct) {
        if (!selectedCategoryId) {
            toast.error('Please select a category first.');
            return;
        }
        setImportingSkus((prev) => new Set(prev).add(product.sku));
        const price = customPrices[product.sku] ?? product.price;
        const ext = { ...product, price };

        const result = await importProduct(ext, selectedCategoryId);
        if (result.error) {
            toast.error(`Failed: ${result.error}`);
        } else {
            toast.success(`Imported "${product.title}" at KES ${price}`);
            setImportedSkus((prev) => new Set(prev).add(product.sku));
        }
        setImportingSkus((prev) => {
            const next = new Set(prev);
            next.delete(product.sku);
            return next;
        });
    }

    // Import all visible curated products
    async function handleImportAllCurated() {
        if (!selectedCategoryId) {
            toast.error('Please select a category first.');
            return;
        }
        const filtered = getFilteredCurated().filter((p) => !importedSkus.has(p.id));
        if (filtered.length === 0) {
            toast.info('All visible products are already imported.');
            return;
        }
        toast.info(`Importing ${filtered.length} products...`);
        for (const p of filtered) {
            await handleImportCurated(p);
        }
        toast.success(`Finished importing ${filtered.length} products!`);
    }

    // Full database reset
    async function handleReset() {
        setResetting(true);
        try {
            const result = await fullDatabaseReset();
            if (result.success) {
                toast.success(
                    `✅ Removed ${result.productsDeleted} products, created ${result.categoriesCreated} beauty categories.`,
                );
                setImportedSkus(new Set());
                setShowResetDialog(false);
                await loadCategories();
            } else {
                toast.error(`Reset failed: ${result.error}`);
            }
        } catch (err) {
            toast.error('Reset failed unexpectedly.');
            console.error(err);
        }
        setResetting(false);
    }

    const filteredCurated = getFilteredCurated();

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="space-y-6">
                <Button asChild variant="ghost" className="rounded-full px-4 -ml-4 text-muted-foreground hover:text-primary transition-all">
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Inventory Ledger
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Data Acquisition</p>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                            Import <span className="text-primary/40 font-serif lowercase italic font-normal tracking-normal ml-2">assets</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-black text-[10px] uppercase tracking-widest h-11 px-6"
                            onClick={() => setShowResetDialog(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Decommission DB
                        </Button>
                        {sourceTab === 'curated' && (
                            <Button
                                className="rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-6 shadow-lg shadow-primary/20"
                                onClick={handleImportAllCurated}
                                disabled={!selectedCategoryId}
                            >
                                <Download className="h-3.5 w-3.5 mr-2" /> Bulk Ingest
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reset Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-card rounded-[40px] p-10 max-w-md mx-4 shadow-2xl border border-border/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-destructive/10 p-3 rounded-2xl">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">System Reset</h2>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-6 leading-relaxed">
                            This operation will perform a <span className="text-foreground font-bold">total wipe</span> of all products, images, and categories. Fresh beauty hierarchies will be re-initialized.
                        </p>
                        <div className="bg-destructive/5 p-4 rounded-2xl border border-destructive/10 mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-destructive">Critical Warning</p>
                            <p className="text-xs font-bold text-destructive/80 mt-1">This action is irreversible and final.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest h-12" onClick={() => setShowResetDialog(false)} disabled={resetting}>
                                Abort
                            </Button>
                            <Button
                                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-black text-[10px] uppercase tracking-widest h-12"
                                onClick={handleReset}
                                disabled={resetting}
                            >
                                {resetting ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Finalizing...</>
                                ) : (
                                    <><RefreshCw className="h-4 w-4 mr-2" /> Confirm Wipe</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Source Selection Area */}
            <div className="bg-muted/30 p-2 rounded-[32px] inline-flex gap-2 border border-border/40">
                <button
                    onClick={() => { setSourceTab('curated'); setSearch(''); }}
                    className={`px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${sourceTab === 'curated'
                        ? 'bg-card text-primary shadow-xl border border-border/50'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    🇰🇪 Domestic Selection
                </button>
                <button
                    onClick={() => { setSourceTab('api'); setSearch(''); }}
                    className={`px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${sourceTab === 'api'
                        ? 'bg-card text-primary shadow-xl border border-border/50'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    🌍 International Feed
                </button>
            </div>

            {/* Controls Ledger */}
            <div className="bg-card border border-border/50 rounded-[40px] p-8 space-y-6 shadow-sm">
                {/* Sector Filters */}
                <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-4">Filter Sectors:</p>
                    {sourceTab === 'curated'
                        ? CURATED_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat.key
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted transition-colors'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))
                        : API_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setApiCategory(cat.key)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${apiCategory === cat.key
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted transition-colors'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                </div>

                {/* Operations Bar */}
                <div className="flex flex-col lg:row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={
                                sourceTab === 'curated'
                                    ? 'Search domestic registries (Dove, Nivea, Vaseline...)...'
                                    : 'Search global feeds (maybelline, dior, l\'oreal)...'
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="relative group min-w-[280px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                            <Package className="h-4 w-4" />
                        </div>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="appearance-none w-full pl-12 pr-10 h-14 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 cursor-pointer transition-all text-[11px] font-bold uppercase tracking-widest"
                        >
                            <option value="">Target Sector Registry...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {sourceTab === 'curated'
                                ? `${filteredCurated.length} Local Units Identified`
                                : loading ? 'Polling External Feed...' : `${total} Global Units Located`}
                        </p>
                    </div>
                    {categories.length === 0 && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Hierarchies missing. Initalize via DB decommissioning.
                        </p>
                    )}
                </div>
            </div>

            {/* Ingestion Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(sourceTab === 'curated' ? filteredCurated : products).map((product) => {
                    const id = sourceTab === 'curated' ? (product as CuratedProduct).id : (product as ExternalProduct).sku;
                    const title = sourceTab === 'curated' ? (product as CuratedProduct).name : (product as ExternalProduct).title;
                    const image = sourceTab === 'curated' ? (product as CuratedProduct).image : (product as ExternalProduct).thumbnail;
                    const brand = product.brand;
                    const desc = sourceTab === 'curated' ? (product as CuratedProduct).description : (product as ExternalProduct).description;
                    const basePrice = sourceTab === 'curated' ? (product as CuratedProduct).suggestedPrice : (product as ExternalProduct).price;
                    const rating = sourceTab === 'curated' ? 4.5 : (product as ExternalProduct).rating;
                    
                    const isImported = importedSkus.has(id);
                    const isImporting = importingSkus.has(id);
                    const currentPrice = customPrices[id] ?? basePrice;

                    return (
                        <div
                            key={id}
                            className={`group bg-card border border-border/50 rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${isImported ? 'opacity-60 grayscale-[0.5]' : ''}`}
                        >
                            <div className="relative aspect-square bg-muted/20 overflow-hidden">
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className={`object-${sourceTab === 'api' ? 'contain p-8' : 'cover'} transition-transform duration-700 group-hover:scale-110`}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    unoptimized
                                />
                                {isImported && (
                                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl">
                                            Registered
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                                        {brand || 'Universal'}
                                    </p>
                                    <h3 className="text-sm font-bold text-foreground tracking-tight leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                        {title}
                                    </h3>
                                    {sourceTab === 'api' && (
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span className="text-[10px] font-black text-muted-foreground">{rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Valuation (KES)</p>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={currentPrice}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setCustomPrices((prev) => ({ ...prev, [id]: val }));
                                            }}
                                            className="w-full px-4 h-11 text-sm font-black text-foreground border border-border/50 rounded-xl bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            disabled={isImported}
                                        />
                                        <Edit3 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => sourceTab === 'curated' ? handleImportCurated(product as CuratedProduct) : handleImportApi(product as ExternalProduct)}
                                    disabled={isImported || isImporting || !selectedCategoryId}
                                    className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        isImported 
                                            ? 'bg-muted text-muted-foreground' 
                                            : 'shadow-lg shadow-primary/10 hover:shadow-primary/20'
                                    }`}
                                >
                                    {isImported ? (
                                        <><Check className="h-3.5 w-3.5 mr-2" /> Registered</>
                                    ) : isImporting ? (
                                        <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Ingesting...</>
                                    ) : (
                                        <><Download className="h-3.5 w-3.5 mr-2" /> Ingest Unit</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {sourceTab === 'api' && loading && products.length === 0 && (
                <div className="py-20 flex justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                </div>
            )}
        </div>
    );
}
