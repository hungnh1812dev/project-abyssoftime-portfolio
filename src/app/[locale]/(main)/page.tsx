import type { BasePageProps } from "@/types/BasicType";

export default async function HomePage({ params }: BasePageProps) {
  const { locale } = await params;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Abyssoftime</h1>
      <p className="text-muted-foreground">locale: {locale}</p>
    </div>
  );
}
