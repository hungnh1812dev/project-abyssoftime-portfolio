import type { CvPageQueryData } from "@/views/cv/cv.types";

export const cvPageMock: CvPageQueryData = {
  cvPages: [
    {
      documentId: "mock-cv-main",
      isMain: true,
      companyName: "General",
      position: "Senior Frontend Developer (Web Marketing)",
      summary: {
        name: "Professional Summary",
        description:
          "Senior Frontend Engineer with 10 years of programming experience, including 6 years specialized in web development and high-performance web applications using React.js, Next.js, and TypeScript. Expert in architecting flexible data-fetching and rendering strategies across SSR, SSG/ISR, and CSR to maximize speed and SEO. Proven track record in structuring Strapi CMS systems, implementing automated CI/CD workflows (GitLab CI), and managing deployments within Kubernetes environments. Specialized in engineering resilient frontend solutions for strict WebView and in-app browser environments, backed by a strong foundation in hardware-level graphics and rendering optimization. Committed to code quality and mentoring, with hands-on experience in pair programming and cross-team collaboration.",
      },
      skills: {
        name: "Technical Skills",
        items: [
          {
            category: "Core Technologies",
            items: [
              { name: "React.js" },
              { name: "Next.js" },
              { name: "TypeScript" },
              { name: "JavaScript (ES6+)" },
              { name: "HTML5" },
              { name: "CSS3" },
            ],
          },
          {
            category: "UI & Styling",
            items: [
              { name: "Tailwind CSS" },
              { name: "Material UI" },
              { name: "SCSS" },
              { name: "Accessibility (A11Y)" },
            ],
          },
          {
            category: "State & Data Layer",
            items: [
              { name: "React Query (TanStack)" },
              { name: "REST APIs" },
              { name: "GraphQL" },
              { name: "SWR" },
              { name: "Context API" },
              { name: "Jotai" },
            ],
          },
          {
            category: "Web Performance & Fundamentals",
            items: [
              { name: "Core Web Vitals" },
              { name: "SSR/ISR/CSR" },
              { name: "SEO" },
              { name: "Browser Rendering" },
            ],
          },
          {
            category: "Tools & DevOps",
            items: [
              { name: "Webpack" },
              { name: "Vite" },
              { name: "Git" },
              { name: "GitLab CI/CD" },
              { name: "Kubernetes" },
              { name: "Jira" },
            ],
          },
        ],
      },
      experiences: {
        name: "Professional Experience",
        items: [
          {
            company: "GL Company",
            location: "Ho Chi Minh City",
            roles: [
              {
                position: "Senior Frontend Developer",
                period: "Mar 2022 – 2026",
                responsibilities:
                  "<ul><li>Development &amp; Mentorship: Handled the full frontend development lifecycle from initial setup to deployment, while mentoring team members through thorough code reviews and pair programming to elevate overall code quality.</li><li>Rendering &amp; Performance: Advanced web speed and optimized Core Web Vitals by strategically architecting data-fetching layouts across SSR, SSG/ISR, and CSR, minimizing page load times through dynamic imports and CDN caching.</li><li>UI/UX &amp; Compatibility: Delivered high-fidelity UI components and fluid animations with optimized rendering, ensuring flawless compatibility across strict environments including Edge 18, WebViews, and in-app browsers.</li><li>Advanced CMS Integration: Structured dynamic, multi-language Strapi CMS architectures and developed custom plugins for scheduled publishing, localized content cloning, and page previews.</li><li>CI/CD &amp; DevOps Automation: Configured and maintained CI/CD pipelines (GitLab CI) to automate build, test, and deployment workflows within Kubernetes environments.</li></ul>",
                techStack: [
                  "React.js",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "GraphQL",
                  "Jest",
                  "Kubernetes",
                  "Strapi",
                ],
                projects:
                  "High-traffic web platforms and marketing campaign systems",
              },
              {
                position: "Frontend Developer",
                period: "Mar 2020 – Feb 2022",
                responsibilities:
                  "<ul><li>Frontend Development: Developed and maintained high-performance web applications from complex Figma designs utilizing React.js, Next.js, and TypeScript.</li><li>Performance &amp; Upgrades: Upgraded core React versions and diagnosed critical production rendering issues to significantly enhance web performance and system stability.</li><li>CMS Integration: Built dynamic, CMS-driven pages using Strapi, empowering non-technical product teams to manage localized content efficiently.</li></ul>",
                techStack: [
                  "React",
                  "Next.js",
                  "JavaScript",
                  "TypeScript",
                  "Strapi",
                ],
                projects:
                  "Web applications, CMS systems, and legacy platform modernization",
              },
              {
                position: "Game Developer",
                period: "Jan 2017 – Feb 2020",
                responsibilities:
                  "<ul><li>Cross-Platform Game Dev: Developed and ported games across multiple platforms, optimizing production builds to ensure smooth performance and stability from low-end to high-end devices.</li><li>Graphics &amp; Rendering Optimization: Enhanced game rendering efficiency and hardware execution through targeted GPU and graphics-level optimizations.</li><li>Cross-Functional Delivery: Collaborated closely with cross-functional teams to deliver high-quality, responsive gaming experiences across diverse device configurations.</li></ul>",
                techStack: [
                  "C/C++",
                  "Java",
                  "JavaScript",
                  "TypeScript",
                  "OpenGL",
                  "GLSL",
                  "WebGL",
                  "Android NDK",
                  "Android SDK",
                ],
                projects: "AAA mobile and web-based games",
              },
            ],
          },
        ],
      },
      projects: {
        name: "Featured Projects",
        items: [
          {
            name: "DDV: Yearly Wrap-up Website",
            description:
              "Built a core profile system supporting 3M+ users using SSR, ISR, and caching strategies to efficiently handle high traffic spikes of 10,000 users/minute. Reduced animation overhead by 45% and configured Kubernetes horizontal auto-scaling for frontend/CMS services, validating a 1,200 RPS capacity via k6 load testing.",
            techStack: [
              "Next.js",
              "React.js",
              "TypeScript",
              "Tailwind CSS",
              "GSAP",
              "K6",
              "Kubernetes",
            ],
            teamSize: 3,
            role: "Senior Frontend Developer & Reviewer",
            link: "https://test.com/wrap-up/global",
            responsitoryLink: undefined,
          },
          {
            name: "DDV",
            description:
              "Built a multi-language Strapi CMS using dynamic SSG/ISR rendering for rapid global content delivery, managing the full lifecycle via GitLab CI/CD and Kubernetes. Implemented high-performance UI animations for Expansion campaigns, driving a 559% increase in Day-1 sessions (from 12,671 to 70,851), validated via GTM and internal tracking.",
            techStack: [
              "Next.js",
              "React.js",
              "TypeScript",
              "Tailwind CSS",
              "GraphQL",
              "GSAP",
              "Kubernetes",
            ],
            teamSize: 6,
            role: "Main PIC & Reviewer",
            link: "https://test.com/",
            responsitoryLink: undefined,
          },
          {
            name: "GL Club (In-App-Browser)",
            description:
              "A core web application running exclusively within in-app browsers for account customization and real-time achievement tracking. Engineered the core frontend architecture optimized for strict in-app browser environments and authored comprehensive unit tests utilizing Vitest to ensure codebase stability. Diagnosed and resolved intricate multi-platform and webview-specific bugs identified during QA and live production to guarantee seamless device compatibility.",
            techStack: ["React.js", "TypeScript", "React Router"],
            role: "Frontend Developer",
            link: undefined,
            responsitoryLink: undefined,
          },
          {
            name: "AL",
            description:
              "Developed responsive promotional UI components that boosted post-rebranding engagement, capturing a 22.5% increase in users and a 34.4% surge in user interactions, validated via GTM tracking.",
            techStack: [
              "React.js",
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "GSAP",
            ],
            teamSize: 4,
            role: "Frontend Developer",
            link: "https://test.com/al",
            responsitoryLink: undefined,
          },
          {
            name: "Personal Portfolio & Dev Toolset",
            description:
              "Established full-stack ownership using Next.js (Vercel), Strapi CMS (Render), and Supabase with automated GitHub Actions pipelines for code-free content updates. Implemented ISR and GraphQL parallel fetching (Promise.all) with silent mock fallbacks for zero downtime, secured by a lightweight, environment-driven passcode gate for private pages.",
            techStack: [
              "Next.js (SSR · ISR)",
              "TypeScript",
              "GraphQL",
              "Strapi CMS",
              "Supabase",
              "Vercel",
              "Render.com",
              "Github Action",
              "Tailwind CSS",
            ],
            role: "design, development, deployment",
            link: "https://test.com/portfolio",
            responsitoryLink:
              "https://github.com/test/test-portfolio-repository",
          },
        ],
      },
      education: {
        name: "Education",
        items: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Science (HCMUS)",
            location: "Ho Chi Minh City",
            period: "2011 – 2016",
            description: "",
          },
        ],
      },
      languages: {
        name: "Languages",
        items: [
          { language: "Vietnamese", level: "Native" },
          {
            language: "English",
            level: "Intermediate (effective communication at work)",
          },
        ],
      },
    },
  ],
};
