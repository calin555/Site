import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BlogCard } from "@/components/shop/BlogCard";
import { Button } from "@/components/ui/Button";
import type { BlogPost } from "@/lib/mock-data";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="bg-surface-50 py-20 sm:py-24">
      <Container>
        <AnimateIn>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              badge="Blog"
              title="Ultimele articole"
              subtitle="Ghiduri practice, noutăți din industrie și sfaturi de la experții noștri tehnici."
            />
            <Link href="/blog">
              <Button variant="outline">
                Toate articolele
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimateIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <AnimateIn key={post.id} delay={i * 120}>
              <BlogCard post={post} />
            </AnimateIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
