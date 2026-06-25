import { cn } from "@/lib/utils";

interface BlogContentProps {
  html: string;
  className?: string;
}

export function BlogContent({ html, className }: BlogContentProps) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <div
        className={cn("blog-content min-w-0", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
