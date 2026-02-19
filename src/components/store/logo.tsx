import Image from 'next/image';

export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MorganShop Logo" width={152} height={40} />
        </div>
    );
}
