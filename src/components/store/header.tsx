'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { storeNavItems, siteConfig } from '@/config/site';
import { useCart } from '@/hooks/use-cart';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

export function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary py-2 text-center border-b border-primary-foreground/10">
        <p className="text-[10px] md:text-xs text-primary-foreground font-bold uppercase tracking-[0.2em]">
          ✨ Free Express Delivery on orders over KES 5,000 • 100% Authentic Guaranteed
        </p>
      </div>

      {/* Top Bar - Simplified */}
      <div className="bg-background border-b border-border/40 py-1.5">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              <span>Help: +254 700 000 000</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">
              My Account
            </Link>
            <Link href="/admin/login" className="text-muted-foreground/40 hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-all duration-300 border-b border-transparent",
        scrolled && "shadow-sm border-border/40 py-1"
      )}>
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden rounded-full"><Menu className="h-5 w-5" /><span className="sr-only">Toggle menu</span></Button></SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full pt-10">
                  <Logo />
                  <nav className="mt-12 flex flex-col gap-1">
                    {storeNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-4 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {storeNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-all group",
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-5 right-5 h-0.5 bg-primary transition-transform duration-300 origin-left",
                    pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Link href="/account" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5 hover:text-primary">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background"
                    >
                      {itemCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart ({itemCount} items)</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}