"use client";

import { useState } from "react";
import Image from "next/image";
import { getBlogCoverImage } from "@/lib/blog/blog-cover-images";

interface BlogCoverImageProps {
  slug: string;
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function BlogCoverImage({
  slug,
  src,
  alt,
  priority,
  className,
}: BlogCoverImageProps) {
  const resolved = getBlogCoverImage(slug, src);
  const [imgSrc, setImgSrc] = useState(resolved);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 768px"
      className={className}
      onError={() => setImgSrc(getBlogCoverImage(slug))}
    />
  );
}
