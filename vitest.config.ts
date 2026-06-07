import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    css: {
      modules: { classNameStrategy: "non-scoped" },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/utils.ts",
        "src/lib/function/regex.ts",
        "src/lib/hooks/useLocale.ts",
        "src/lib/external-link/ExternalLink.tsx",
        "src/components/ui/PageEmptyState.tsx",
        "src/components/ui/ThemeToggle.tsx",
        "src/components/providers/ThemeProvider.tsx",
      ],
      thresholds: {
        branches: 75,
      },
    },
  },
});
