interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const normalized = description.replace(/\r\n/g, "\n").trim();
  const blocks = normalized.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="prose prose-surface max-w-none">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="mb-4 whitespace-pre-line leading-relaxed text-surface-600 last:mb-0"
        >
          {block}
        </div>
      ))}
    </div>
  );
}
