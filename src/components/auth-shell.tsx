import type { ReactNode } from "react";
import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";

export function AuthShell({
  children,
  image,
  caption,
}: {
  children: ReactNode;
  image: string;
  caption: string;
}) {
  return (
    <main className="grid min-h-screen bg-ivory text-ink lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <BrandMark />
          <p className="mt-8 max-w-sm font-display text-4xl leading-tight text-ivory">
            {caption}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <BrandMark tone="dark" />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
