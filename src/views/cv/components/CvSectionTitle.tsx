interface CvSectionTitleProps {
  title: string;
}

export function CvSectionTitle({ title }: CvSectionTitleProps) {
  return (
    <div className="mb-3 border-b border-border pb-1">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{title}</h2>
    </div>
  );
}
