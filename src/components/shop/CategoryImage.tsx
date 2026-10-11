"use client";

import { useState } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { shouldSkipImageOptimization } from "@/lib/utils";

interface CategoryImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export function CategoryImage({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: CategoryImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src?.trim()) && !failed;

  if (!showImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-700 via-surface-800 to-surface-900">
        <Zap className="h-12 w-12 text-brand-300" />
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      unoptimized={shouldSkipImageOptimization(src)}
      onError={() => setFailed(true)}
    />
  );
}
