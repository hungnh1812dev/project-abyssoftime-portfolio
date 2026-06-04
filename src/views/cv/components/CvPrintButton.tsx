"use client";

import { Printer } from "lucide-react";

export function CvPrintButton() {
  return (
    <div className="no-print mt-8 flex justify-center pb-8">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-opacity hover:opacity-80"
      >
        <Printer size={16} />
        Print / Save as PDF
      </button>
    </div>
  );
}
