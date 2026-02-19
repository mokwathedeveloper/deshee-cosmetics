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
      <div className="bg-primary overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block py-2">
          <span className="text-xs text-primary-foreground/90 tracking-wide mx-8">
            ✨ FREE DELIVERY in Nairobi on orders over KES 5,000
          </span>
          <span className="text-xs text-primary-foreground/70 mx-8">|</span>
          <span className="text-xs text-primary-foreground/90 tracking-wide mx-8">
            🎁 New arrivals added every week
          </span>
          <span className="text-xs text-primary-foreground/70 mx-8">|</span>
          <span className="text-xs text-primary-foreground/90 tracking-wide mx-8">
            💯 100% Authentic Products — Original Brands Only
          </span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-background border-b">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>Need help? Call us</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">
              My Account
            </Link>
            <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 bg-background transition-all duration-300",
        scrolled && "shadow-md"
      )}>
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Logo />
                  </div>
                  <nav className="flex-1 space-y-2">
                    {storeNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent"
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
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center bg-muted rounded-full px-2 py-1">
              {storeNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-6 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-background"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" className="rounded-full">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Link href="/account">
                <Button variant="secondary" size="icon" className="hidden sm:flex rounded-full">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="secondary" size="icon" className="relative rounded-full">
                  <ShoppingBag className="h-4 w-4" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
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