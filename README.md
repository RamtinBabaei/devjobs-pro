# DevJobs Pro v2
## Live Demo
[View Live Demo] (https://ramtinbabaei.github.io/devjobs-pro/)
A portfolio-ready developer job search platform built with **React, TypeScript, Tailwind CSS, React Router, TanStack Query, and Vite**.

DevJobs combines live remote-job data with client-side search, shareable filters, saved jobs, and an application tracker. The UI is intentionally product-like rather than a simple tutorial project.

## Highlights

- Multi-page routing with React Router
- Shareable URL-based search and filters
- Live software-development jobs from the Remotive public API
- TanStack Query caching and retry behavior
- Six-hour browser cache to reduce unnecessary public API traffic
- Safe built-in demo fallback when the API is unavailable
- Saved Jobs page with validated localStorage persistence
- Application Tracker with Applied / Interview / Offer / Rejected stages
- Dynamic job detail routes
- Loading skeletons, fallback/error states, and empty states
- Responsive mobile navigation
- Accessible buttons, labels, keyboard focus states, and tab semantics
- TypeScript-first data models and runtime guards for external/stored data
- GitHub Pages deployment workflow
- Automated unit tests for filtering, sorting, salary parsing, data integrity, URL safety, and mapping helpers

## Routes

GitHub Pages is served with `HashRouter`, so internal routes work after refresh:

- `#/jobs`
- `#/jobs/:id`
- `#/saved`
- `#/applications`

Search/filter state is stored in the URL. Example:

```text
#/jobs?q=React&mode=Remote&tech=TypeScript&sort=salary-high
```

## Live API

The Jobs page requests software-development roles from the **Remotive Public API**:

```text
https://remotive.com/api/remote-jobs?category=software-dev&limit=30
```

Results are cached locally for six hours. This keeps the demo responsive and stays aligned with Remotive's guidance not to request public job data too frequently.

If the API is unavailable, the app switches to a clearly labeled built-in demo dataset instead of breaking the UI.

For live listings, DevJobs:

- identifies Remotive as the data source;
- links users back to the original Remotive listing;
- does not collect email addresses or require signup to view a listing.

See the official API documentation and terms before reusing the project commercially:

- https://remotive.com/remote-jobs/api
- https://github.com/remotive-com/remote-jobs-api

## Application tracking behavior

Opening a source listing does **not** automatically mark a job as applied. The user explicitly chooses **Mark as applied** before the role enters the local application tracker. This keeps the demo behavior honest and predictable.

Application and saved-job data are stored only in the current browser using localStorage. There is no authentication or backend in v2.

## Run locally

Requirements:

- Node.js **22.12+**
- npm

Install dependencies:

```bash
npm install
```

`npm install` creates `package-lock.json`. Commit that file to GitHub so future installs and CI builds are reproducible.

Start development:

```bash
npm run dev
```

Run all production checks:

```bash
npm run check
```

Or run them separately:

```bash
npm test
npm run typecheck
npm run build
```

## Tech stack

- React 19
- TypeScript
- Tailwind CSS 4
- React Router 6
- TanStack Query 5
- Vite 7
- LocalStorage
- Node.js test runner
- GitHub Actions / GitHub Pages

## Project structure

```text
src/
├── api/          # Remotive request + API normalization helpers
├── components/   # Job, layout and reusable UI components
├── context/      # Saved jobs and application tracker state
├── data/         # Offline/demo fallback jobs
├── hooks/        # Reusable localStorage hook
├── pages/        # Jobs, Saved, Applications and 404 pages
├── types/        # Domain and router types
└── utils/        # Filters, sort, URL safety and runtime guards

tests/            # Node-based unit/data-integrity tests
```

## Portfolio skills demonstrated

This project demonstrates component architecture, routing, asynchronous API work, caching, URL state, filtering/sorting, persistent client state, runtime validation, responsive UI, error handling, accessibility basics, TypeScript modeling, testing, and deployment automation.

## Deployment

A GitHub Actions workflow is included at:

```text
.github/workflows/deploy.yml
```

In GitHub, enable:

**Settings → Pages → Source: GitHub Actions**

The workflow installs dependencies, runs tests, runs TypeScript checks, creates a production build, and deploys `dist/`.

## License

MIT
