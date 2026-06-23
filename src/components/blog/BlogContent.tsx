import { cn } from "@/lib/utils";

interface BlogContentProps {
  html: string;
  className?: string;
}

export function BlogContent({ html, className }: BlogContentProps) {
  return (
    <div
      className={cn("blog-content max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
