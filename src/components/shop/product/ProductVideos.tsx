"use client";

import { Film } from "lucide-react";

interface ProductVideosProps {
  videos: string[];
  productName: string;
}

export function ProductVideos({ videos, productName }: ProductVideosProps) {
  if (videos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Film className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-surface-800">Video produs</h2>
      </div>

      <div className="space-y-4">
        {videos.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="overflow-hidden rounded-2xl border border-surface-200 bg-surface-900"
          >
            <video
              src={url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full object-contain"
              aria-label={
                videos.length > 1
                  ? `${productName} — video ${index + 1}`
                  : `${productName} — video`
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
