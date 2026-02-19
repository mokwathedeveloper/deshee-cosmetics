import Image from 'next/image';
import { siteConfig } from '@/config/site';

export function Logo({ inverted = false }: { inverted?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={152}
                height={60}
                className={`h-12 lg:h-14 w-auto object-contain ${inverted ? 'brightness-0 invert' : ''}`}
                priority
            />
        </div>
    );
}
