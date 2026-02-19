export const siteConfig = {
    name: 'DeeShee Beauty Empire',
    description: 'Premium beauty & skincare products — delivering across Kenya.',
    url: 'https://deshee-cosmetics.co.ke',
    currency: 'KES',
    logo: '/logo-deeshee.png',
};

export const storeNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Skincare', href: '/shop/skincare' },
    { label: 'Makeup', href: '/shop/makeup' },
    { label: 'Fragrance', href: '/shop/fragrance' },
];

export const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' as const },
    { label: 'Products', href: '/admin/products', icon: 'Package' as const },
    { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' as const },
    { label: 'Categories', href: '/admin/categories', icon: 'Grid3X3' as const },
];

export const orderStatuses = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Top Rated' },
];
