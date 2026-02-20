export default function ContactPage() {
    return (
        <div className="container py-24">
            <h1 className="text-4xl font-black tracking-tight mb-8">Contact Us</h1>
            <div className="max-w-2xl text-muted-foreground space-y-4">
                <p>We're here to help you with any questions about our products or your order.</p>
                <div className="grid gap-6 mt-12">
                    <div>
                        <h3 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Email</h3>
                        <p>support@deeshee.com</p>
                    </div>
                    <div>
                        <h3 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Phone</h3>
                        <p>+254 700 000 000</p>
                    </div>
                    <div>
                        <h3 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Location</h3>
                        <p>Nairobi, Kenya</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
