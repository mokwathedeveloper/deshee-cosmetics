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
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
                        <p className="text-sm text-gray-500">
                            Browse products, set your own KES prices, and import
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setShowResetDialog(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Reset DB
                    </Button>
                    {sourceTab === 'curated' && (
                        <Button
                            size="sm"
                            className="bg-[#036B3F] hover:bg-[#025a33] text-white"
                            onClick={handleImportAllCurated}
                            disabled={!selectedCategoryId}
                        >
                            <Download className="h-4 w-4 mr-1" /> Import All Visible
                        </Button>
                    )}
                </div>
            </div>

            {/* Reset Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Reset Database?</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">This will:</p>
                        <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
                            <li>Delete <strong>ALL</strong> existing products and images</li>
                            <li>Delete all existing categories</li>
                            <li>Create 8 fresh beauty categories</li>
                        </ul>
                        <p className="text-xs text-red-500 font-medium mb-4">⚠ This action cannot be undone!</p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(false)} disabled={resetting}>
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleReset}
                                disabled={resetting}
                            >
                                {resetting ? (
                                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Resetting...</>
                                ) : (
                                    <><RefreshCw className="h-4 w-4 mr-1" /> Yes, Reset</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Source Tabs: Curated vs API */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => { setSourceTab('curated'); setSearch(''); }}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${sourceTab === 'curated'
                        ? 'border-[#036B3F] text-[#036B3F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    🇰🇪 Kenyan Brands ({curatedProducts.length} products)
                </button>
                <button
                    onClick={() => { setSourceTab('api'); setSearch(''); }}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${sourceTab === 'api'
                        ? 'border-[#036B3F] text-[#036B3F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    🌍 International Brands (900+ products)
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white border rounded-lg p-4 mb-4 space-y-3">
                {/* Category filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {sourceTab === 'curated'
                        ? CURATED_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat.key
                                    ? 'bg-[#036B3F] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))
                        : API_CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setApiCategory(cat.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${apiCategory === cat.key
                                    ? 'bg-[#036B3F] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                </div>

                {/* Search + Store Category */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={
                                sourceTab === 'curated'
                                    ? 'Search brands (Dove, Nivea, Vaseline, Lux...)...'
                                    : 'Search brands (maybelline, dior, l\'oreal)...'
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#036B3F]/30 focus:border-[#036B3F] outline-none min-w-[200px]"
                    >
                        <option value="">Import into category...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Info bar */}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        {sourceTab === 'curated'
                            ? `${filteredCurated.length} products`
                            : loading ? 'Loading...' : `${total} products found`}
                    </p>
                    {categories.length === 0 && (
                        <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            No categories! Click &quot;Reset DB&quot; to create beauty categories.
                        </p>
                    )}
                </div>
            </div>

            {/* ───── CURATED PRODUCTS GRID ───── */}
            {sourceTab === 'curated' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCurated.map((product) => {
                        const isImported = importedSkus.has(product.id);
                        const isImporting = importingSkus.has(product.id);
                        const currentPrice = customPrices[product.id] ?? product.suggestedPrice;

                        return (
                            <div
                                key={product.id}
                                className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-md ${isImported ? 'opacity-60 border-green-200' : ''
                                    }`}
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        unoptimized
                                    />
                                    {isImported && (
                                        <span className="absolute top-2 right-2 bg-[#036B3F] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                            <Check className="h-3 w-3" /> Imported
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3.5">
                                    <p className="text-[10px] font-semibold tracking-wider uppercase text-[#036B3F] mb-1">
                                        {product.brand}
                                    </p>
                                    <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Editable Price */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-gray-500">KES</span>
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={currentPrice}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setCustomPrices((prev) => ({ ...prev, [product.id]: val }));
                                                }}
                                                className="w-full px-3 py-1.5 text-base font-bold text-[#E02B27] border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#036B3F]/30 focus:border-[#036B3F] outline-none"
                                                disabled={isImported}
                                            />
                                            <Edit3 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-300" />
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {product.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Import Button */}
                                    <button
                                        onClick={() => handleImportCurated(product)}
                                        disabled={isImported || isImporting || !selectedCategoryId}
                                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${isImported
                                            ? 'bg-green-50 text-green-600 cursor-default'
                                            : isImporting
                                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                : !selectedCategoryId
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-[#036B3F] text-white hover:bg-[#025a33] active:scale-[0.98]'
                                            }`}
                                    >
                                        {isImported ? (
                                            <><Check className="h-4 w-4" /> Imported</>
                                        ) : isImporting ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</>
                                        ) : (
                                            <><Download className="h-4 w-4" /> Import at KES {currentPrice}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ───── API PRODUCTS GRID ───── */}
            {sourceTab === 'api' && (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-[#036B3F]" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No products found</p>
                            <p className="text-sm text-gray-400">Try a different category or search for a brand</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((product) => {
                                const isImported = importedSkus.has(product.sku);
                                const isImporting = importingSkus.has(product.sku);
                                const currentPrice = customPrices[product.sku] ?? product.price;

                                return (
                                    <div
                                        key={product.id}
                                        className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-md ${isImported ? 'opacity-60 border-green-200' : ''
                                            }`}
                                    >
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.title}
                                                fill
                                                className="object-contain p-4"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                unoptimized
                                            />
                                            {isImported && (
                                                <span className="absolute top-2 right-2 bg-[#036B3F] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                                    <Check className="h-3 w-3" /> Imported
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3.5">
                                            {product.brand && (
                                                <p className="text-[10px] font-semibold tracking-wider uppercase text-[#036B3F] mb-1">
                                                    {product.brand}
                                                </p>
                                            )}
                                            <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                                            </div>

                                            {/* Editable Price */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs text-gray-500">KES</span>
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        value={currentPrice}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setCustomPrices((prev) => ({ ...prev, [product.sku]: val }));
                                                        }}
                                                        className="w-full px-3 py-1.5 text-base font-bold text-[#E02B27] border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#036B3F]/30 focus:border-[#036B3F] outline-none"
                                                        disabled={isImported}
                                                    />
                                                    <Edit3 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-300" />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleImportApi(product)}
                                                disabled={isImported || isImporting || !selectedCategoryId}
                                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${isImported
                                                    ? 'bg-green-50 text-green-600 cursor-default'
                                                    : isImporting
                                                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                        : !selectedCategoryId
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-[#036B3F] text-white hover:bg-[#025a33] active:scale-[0.98]'
                                                    }`}
                                            >
                                                {isImported ? (
                                                    <><Check className="h-4 w-4" /> Imported</>
                                                ) : isImporting ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</>
                                                ) : (
                                                    <><Download className="h-4 w-4" /> Import at KES {currentPrice}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
