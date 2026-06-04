"use client";

export const PrintButton: React.FC<{ className?: string }> = ({ className }) => (
  <button
    className={`rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground ${className ?? ""}`}
    onClick={() => window.print()}
  >
    Print / Save PDF
  </button>
);
