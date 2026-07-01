import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CompletedProject } from "@/lib/content/projects";

interface ProjectCardProps {
  project: CompletedProject;
  compact?: boolean;
}

export function ProjectCard({ project, compact }: ProjectCardProps) {
  const photo = project.photos[0];

  return (
    <Card padding="none" className="overflow-hidden">
      {photo && (
        <div className="relative aspect-[16/10] bg-surface-100">
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {project.clientType}
        </p>
        <h3 className="mt-1 text-lg font-bold text-surface-900">{project.title}</h3>
        <p className="mt-1 text-sm text-surface-500">{project.location}</p>
        {!compact && (
          <>
            <p className="mt-3 text-sm text-surface-600">
              <strong>Stație:</strong> {project.stationInstalled}
            </p>
            <p className="mt-1 text-sm text-surface-600">
              <strong>Durată:</strong> {project.duration}
            </p>
            <p className="mt-3 text-sm text-surface-700">{project.result}</p>
          </>
        )}
        {project.relatedLanding && (
          <Link
            href={project.relatedLanding}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Soluție similară
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </Card>
  );
}
