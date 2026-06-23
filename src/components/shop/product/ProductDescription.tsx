interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const paragraphs = description.split("\n\n").filter(Boolean);

  return (
    <div className="prose prose-surface max-w-none">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="mb-4 leading-relaxed text-surface-600 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
