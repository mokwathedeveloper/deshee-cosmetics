'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="max-w-5xl mx-auto">
                <div className="space-y-4 mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Get in Touch</p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Contact Us</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        Have a question about our premium products or an existing order? Our beauty experts are here to assist you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="border-border/50 rounded-[32px] overflow-hidden shadow-xl shadow-primary/5">
                            <CardContent className="p-8 md:p-10">
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                                            <Input id="first-name" placeholder="Jane" className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                                            <Input id="last-name" placeholder="Doe" className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                        <Input id="email" type="email" placeholder="jane@example.com" className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</Label>
                                        <Textarea id="message" placeholder="How can we help you?" rows={5} className="rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 p-4" />
                                    </div>
                                    <Button className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all mt-4">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-10 py-4">
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Email Us</h3>
                                    <p className="text-muted-foreground font-medium">support@deeshee.com</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold tracking-tighter">Response within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Call Us</h3>
                                    <p className="text-muted-foreground font-medium">+254 700 000 000</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold tracking-tighter">Mon-Fri, 9am-6pm EAT</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Visit Our Studio</h3>
                                    <p className="text-muted-foreground font-medium">Nairobi, Kenya</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-bold tracking-tighter">By appointment only</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary text-primary-foreground p-8 rounded-[32px] relative overflow-hidden shadow-2xl shadow-primary/20 group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors" />
                            <MessageSquare className="h-8 w-8 mb-4 opacity-40" />
                            <h3 className="text-xl font-bold mb-2">Live Support</h3>
                            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                                Need instant help? Our beauty concierge is available via WhatsApp for real-time advice.
                            </p>
                            <Button variant="secondary" className="w-full rounded-xl font-bold text-[10px] uppercase tracking-widest h-12">
                                Chat on WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
