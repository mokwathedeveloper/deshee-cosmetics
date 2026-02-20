export default function ShippingPage() {
    return (
        <div className="container py-24">
            <h1 className="text-4xl font-black tracking-tight mb-8">Shipping & Returns</h1>
            <div className="max-w-3xl prose prose-stone">
                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-4">Shipping Policy</h2>
                    <p className="text-muted-foreground mb-4">We offer fast and reliable shipping across Kenya. Orders placed before 12:00 PM are typically processed the same day.</p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                        <li>Nairobi Express: 3-5 hours (KES 300)</li>
                        <li>Nairobi Standard: 24 hours (Free over KES 5,000)</li>
                        <li>Upcountry: 2-3 business days (From KES 500)</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-4">Returns & Exchanges</h2>
                    <p className="text-muted-foreground">Due to the hygienic nature of beauty products, we only accept returns for items that are damaged or incorrect. Please contact us within 7 days of delivery.</p>
                </section>
            </div>
        </div>
    );
}
