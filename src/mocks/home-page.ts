import type { HomePageQueryData } from "@/views/home/home.types";

export const homePageMock: HomePageQueryData = {
  homePage: {
    headline: "Building fast, scalable frontends that move metrics.",
    subheadline:
      "Senior Frontend Engineer with 10 years of programming experience, 6 in web. Specialized in high-performance applications, headless CMS platforms, and resilient in-app browser environments.",
    sectionTitles: {
      impact: "By the Numbers",
      projects: "Featured Work",
      specializations: "What I Do",
      skills: "Technical Skills",
      contact: "Let's Work Together",
    },
    impactStats: [
      { value: "3M+", label: "Users served", note: "DDV Yearly Wrap-up" },
      { value: "559%", label: "Day-1 session growth", note: "DDV main site relaunch" },
      { value: "10k/min", label: "Peak request throughput", note: "k6 load validated" },
      { value: "45%", label: "Animation overhead cut", note: "GSAP timeline batching" },
    ],
    projects: [
      {
        title: "DDV: Yearly Wrap-up",
        tagline: "A personalized recap experience scaled to 3M+ concurrent users",
        role: "Lead Frontend Engineer",
        period: "2024",
        challenge:
          "Build a profile-based retrospective that absorbs viral traffic spikes — peak load 10k users/min — with zero degradation in user experience.",
        approach:
          "Architected SSR + ISR with aggressive CDN cache layering. Reduced animation overhead 45% via GSAP timeline batching. Provisioned Kubernetes HPA and validated 1,200 RPS capacity with k6 load testing.",
        outcomes: [
          { value: "3M+", label: "Active users" },
          { value: "10k/min", label: "Peak traffic handled" },
          { value: "45%", label: "Animation overhead reduced" },
          { value: "1,200 RPS", label: "Validated throughput" },
        ],
        techStack: ["Next.js", "TypeScript", "GSAP", "Kubernetes", "k6"],
        thumbnail: null,
        link: "https://test.com/wrap-up/global",
      },
      {
        title: "DDV Main Site",
        tagline: "Multi-language marketing platform — 559% session growth on day one",
        role: "Frontend Developer → Lead",
        period: "2020–2024",
        challenge:
          "Replace a slow static site with a CMS-driven platform where content editors ship without code, while measurably improving performance and engagement.",
        approach:
          "Built a headless Strapi CMS with dynamic SSG/ISR routes for near-instant global delivery. Engineered GSAP animation sequences validated via GTM event tracking.",
        outcomes: [
          { value: "559%", label: "Day-1 session growth" },
          { value: "70,851", label: "Sessions on launch day" },
          { value: "12→70K", label: "Daily sessions jump" },
        ],
        techStack: ["Next.js", "TypeScript", "GraphQL", "Strapi CMS", "GSAP", "Kubernetes"],
        thumbnail: null,
        link: "https://test.com/",
      },
      {
        title: "GL Club (In-App Browser)",
        tagline: "Mission-critical account app engineered for restrictive WebView environments",
        role: "Frontend Engineer",
        period: "2022–2024",
        challenge:
          "Build account customization and real-time achievement tracking inside iOS/Android in-app browsers — environments without localStorage, service workers, or consistent rendering APIs.",
        approach:
          "Designed a runtime adapter layer normalizing WebView APIs across platforms. Implemented memory-efficient state management without localStorage dependency.",
        outcomes: [
          { value: "0", label: "Critical WebView crashes post-launch" },
          { value: "iOS + Android", label: "In-app browser compatibility" },
        ],
        techStack: ["React.js", "TypeScript", "React Router"],
        thumbnail: null,
      },
    ],
    specializations: [
      {
        title: "High-Performance Frontend Architecture",
        description:
          "Designing SSR/ISR/CSR rendering strategies and CDN layers that hold under viral traffic. Profiling and eliminating bottlenecks — Core Web Vitals, animation overhead, cache strategy — before they reach production.",
      },
      {
        title: "Marketing & Campaign Platforms",
        description:
          "Engineering headless CMS-driven sites where content editors ship without code. Proven track record in measurable launch impact: session growth, engagement, and conversion.",
      },
      {
        title: "Resilient WebView Engineering",
        description:
          "Specialized in frontend systems for iOS/Android in-app browsers where standard web APIs don't exist. Custom adapter layers, memory-safe state, and cross-environment testing.",
      },
      {
        title: "Team Enablement & Code Quality",
        description:
          "Structured CI/CD workflows (GitLab CI, GitHub Actions), thorough code review, and pair programming to raise team output quality without slowing velocity.",
      },
    ],
    skills: [
      { category: "Core", items: ["React.js", "Next.js", "TypeScript", "JavaScript ES6+"] },
      { category: "Styling", items: ["Tailwind CSS", "Material UI", "SCSS"] },
      { category: "Data", items: ["GraphQL", "REST", "React Query", "SWR", "Jotai"] },
      { category: "Performance", items: ["Core Web Vitals", "SSR · ISR · CSR", "SEO", "GSAP"] },
      { category: "DevOps", items: ["GitLab CI/CD", "GitHub Actions", "Kubernetes", "Vite", "Webpack"] },
    ],
  },
};
