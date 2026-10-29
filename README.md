# SiteLaunchCheck

**SiteLaunchCheck** is a Website Pre-Launch QA SaaS product designed for freelancers, web designers, and agencies to catch issues before delivering a website to a client.

## Project Architecture

```
site-launch-check/
├── app/                  # Next.js App Router (Pages & API Routes)
├── components/           # Reusable UI components by feature area
│   ├── landing/          # Landing page specific components
│   ├── audit/            # Audit dashboard components
│   ├── results/          # Result visualization components
│   └── layout/           # Shared layout components
├── lib/                  # Core business logic and integrations
│   ├── crawler/          # Playwright/Cheerio integrations
│   ├── checks/           # Modular, independent audit checks
│   │   ├── seo/
│   │   ├── links/
│   │   ├── images/
│   │   ├── forms/
│   │   ├── technical/
│   │   ├── content/
│   │   ├── accessibility/
│   │   └── mobile/
│   ├── scoring/          # Scoring engine calculations
│   └── utils/            # General utilities
├── types/                # Shared TypeScript definitions
├── public/               # Static assets
└── tests/                # Unit and integration tests
```

## MVP Audit Categories
1. SEO Essentials
2. Links
3. Images
4. Forms
5. Technical
6. Content / Client Delivery
7. Accessibility Basics
8. Mobile / UX

## Development Phases
- **Phase 1**: Project Setup, Design System, Landing Page, Architecture scaffolding (Completed).
- **Phase 2**: Crawler integration, SEO, Technical, Link checks.
- **Phase 3**: Image, Form, Content, Accessibility, Mobile checks.
- **Phase 4**: Scoring Engine, Results Dashboard, Re-run Audit.
- **Phase 5**: Testing, Error Handling, Security, Polish.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.
