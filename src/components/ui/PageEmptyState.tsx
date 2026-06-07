"use client";

export function PageEmptyState() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skeleton */}
      <div aria-hidden="true" className="mx-auto w-full max-w-4xl animate-pulse space-y-8 px-6 py-16">
        <div className="space-y-3">
          <div className="h-10 w-2/3 rounded-md bg-muted" />
          <div className="h-5 w-1/2 rounded-md bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-5 w-1/4 rounded-md bg-muted" />
          <div className="h-40 rounded-lg bg-muted" />
          <div className="h-40 rounded-lg bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-1/4 rounded-md bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 rounded-lg bg-muted" />
            <div className="h-24 rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="fixed inset-x-0 bottom-0 flex justify-center pb-8">
        <div role="alert" className="mx-4 flex max-w-sm flex-col items-center gap-3 rounded-xl border bg-background/95 px-6 py-4 shadow-lg backdrop-blur-sm">
          <p className="text-center text-sm text-muted-foreground">
            Content is temporarily unavailable.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
