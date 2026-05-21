import Image from "next/image";
import Link from "next/link";

export function ApexLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/brand/apex-logo-white.png"
        alt="Apex"
        width={120}
        height={32}
        className="h-7 w-auto md:h-8"
        priority
      />
    </Link>
  );
}

export function ApexLogoMark({ className = "h-16 w-16 opacity-40" }: { className?: string }) {
  return (
    <Image
      src="/brand/apex-logo-white.png"
      alt=""
      width={64}
      height={64}
      className={`object-contain ${className}`}
      aria-hidden
    />
  );
}
