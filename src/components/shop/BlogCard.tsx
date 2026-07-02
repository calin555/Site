"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getBlogCoverImage } from "@/lib/blog/blog-cover-images";
import type { BlogPost } from "@/lib/mock-data";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const fallback = getBlogCoverImage(post.slug, post.coverImage);
  const [imgSrc, setImgSrc] = useState(fallback);

  const date = new Date(post.publishedAt).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group card-lift flex flex-col overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-elev-1 hover:border-brand-300/60">
      <Link href={`/blog/${post.slug}`} className="relative">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-100">
          <Image
            src={imgSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc(getBlogCoverImage(post.slug))}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="brand" className="mb-3 w-fit">
          {post.category}
        </Badge>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-bold text-surface-900 transition-colors group-hover:text-brand-700 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm text-surface-500 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
          <div className="flex items-center gap-3 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Citește <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
