'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  CheckCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { createOrder } from '@/actions/orders';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function CheckoutForm() {
  const { items, total, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    notes: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createOrder(formData, items);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/shop')} variant="outline" className="rounded-full px-8">
          Back to Shop
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container max-w-2xl py-24 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Thank you for choosing Deeshee Cosmetics. Your order has been placed successfully and we&apos;re getting it ready for delivery.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="bg-muted/50 p-6 rounded-3xl border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                <p className="font-bold text-emerald-600">Processing</p>
            </div>
            <div className="bg-muted/50 p-6 rounded-3xl border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Delivery</p>
                <p className="font-bold">2-3 Business Days</p>
            </div>
        </div>
        <Button onClick={() => router.push('/shop')} size="lg" className="rounded-full px-12 h-14 font-bold text-base shadow-xl shadow-primary/20">
          Return to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 pb-24">
      <div className="lg:col-span-7 space-y-12">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section: Contact */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="text-xl font-bold tracking-tight">Contact Information</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                <Input 
                  id="customer_name" 
                  name="customer_name" 
                  value={formData.customer_name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Jane Doe"
                  className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                <Input 
                  id="customer_phone" 
                  name="customer_phone" 
                  value={formData.customer_phone} 
                  onChange={handleChange} 
                  required
                  placeholder="+254 --- --- ---"
                  className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input 
                id="customer_email" 
                name="customer_email" 
                type="email" 
                value={formData.customer_email} 
                onChange={handleChange} 
                required 
                placeholder="jane@example.com"
                className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20"
              />
            </div>
          </section>

          <Separator className="bg-border/40" />

          {/* Section: Shipping */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="text-xl font-bold tracking-tight">Shipping Details</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_address" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</Label>
              <Input 
                id="shipping_address" 
                name="shipping_address" 
                value={formData.shipping_address} 
                onChange={handleChange} 
                required 
                placeholder="Street name, Building, Apartment No."
                className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_city" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City / Region</Label>
              <Input 
                id="shipping_city" 
                name="shipping_city" 
                value={formData.shipping_city} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Nairobi, Westlands"
                className="rounded-xl h-12 bg-muted/30 border-border/50 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Additional Instructions (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Special delivery notes..."
                className="rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20"
              />
            </div>
          </section>

          <Separator className="bg-border/40" />

          {/* Section: Payment Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <h2 className="text-xl font-bold tracking-tight">Payment Method</h2>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-foreground">Cash on Delivery / M-Pesa on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay safely when you receive your package.</p>
                </div>
            </div>
          </section>

          <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0">
            {loading ? 'Processing...' : `Confirm Order • ${formatCurrency(total)}`}
          </Button>

          <div className="flex items-center justify-center gap-8 pt-4 opacity-40 grayscale">
            <ShieldCheck className="h-8 w-8" />
            <CreditCard className="h-8 w-8" />
            <Truck className="h-8 w-8" />
          </div>
        </form>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-5">
        <div className="bg-muted/30 rounded-[40px] p-8 lg:p-10 border border-border/40 sticky top-24">
            <h2 className="text-xl font-bold mb-8">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-background border border-border/50 flex-shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs font-bold text-primary mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-sm font-black text-foreground">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                </div>
            ))}
            </div>

            <Separator className="bg-border/40 mb-6" />
            
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="text-foreground font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">Free</span>
                </div>
                <div className="pt-6 border-t border-border/40 flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                        <p className="text-3xl font-black text-primary tracking-tighter leading-none">{formatCurrency(total)}</p>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Secure Checkout</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 p-6 bg-background/50 rounded-3xl border border-border/40 border-dashed">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    By confirming your order, you agree to Deeshee Cosmetics&apos; <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
