export default function FAQPage() {
    const faqs = [
        { q: 'Are your products authentic?', a: 'Yes, we only sell 100% authentic products sourced directly from brands or authorized distributors.' },
        { q: 'Where do you deliver?', a: 'We deliver nationwide across Kenya, with express delivery available in Nairobi.' },
        { q: 'How can I track my order?', a: 'Once your order is shipped, you will receive a tracking number via email or SMS.' },
    ];

    return (
        <div className="container py-24">
            <h1 className="text-4xl font-black tracking-tight mb-12">Frequently Asked Questions</h1>
            <div className="max-w-3xl space-y-12">
                {faqs.map((faq, i) => (
                    <div key={i}>
                        <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
                        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
