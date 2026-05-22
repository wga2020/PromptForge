# Task: Build Premium Print-on-Demand AI Prompt Generator Web Application

## Summary
Built a comprehensive Next.js 16 single-page application for generating AI image prompts for print-on-demand personalized products.

## Files Created/Modified

### Core Data & Constants
- `/src/lib/data.ts` - All product types, niches, design styles, AI tools, color palettes, font maps, calendar events seed data (111 events), and prompt generation template function

### API Routes
- `/src/app/api/prompts/route.ts` - GET (list with filters), POST (create)
- `/src/app/api/prompts/[id]/route.ts` - GET, PUT, DELETE
- `/src/app/api/prompts/copy/route.ts` - POST (duplicate prompt)
- `/src/app/api/prompts/export/route.ts` - POST (export as JSON/TXT)
- `/src/app/api/projects/route.ts` - GET, POST
- `/src/app/api/projects/[id]/route.ts` - GET, PUT, DELETE
- `/src/app/api/sessions/route.ts` - GET, POST
- `/src/app/api/sessions/[id]/route.ts` - PUT, DELETE
- `/src/app/api/calendar/route.ts` - GET (with filters)
- `/src/app/api/calendar/seed/route.ts` - POST (seed 111 events)
- `/src/app/api/generate/route.ts` - POST (AI prompt enhancement using z-ai-web-dev-sdk)
- `/src/app/api/stats/route.ts` - GET (dashboard statistics)

### Frontend
- `/src/app/page.tsx` - Single page app with 5 tabs (Dashboard, Prompt Generator, Projects, Calendar, My Prompts)
- `/src/app/layout.tsx` - Updated metadata for PromptForge branding

## Features Implemented

1. **Dashboard** - Stats overview with 6 stat cards, bar chart (prompts by product), niche chart, recent prompts list, quick action buttons
2. **Prompt Generator** - 5-step wizard (Product → Niche → Design → Fonts → Generate) with progress indicator, color palette previews, font recommendations, AI regeneration, copy/save functionality
3. **Projects** - CRUD with color picker, niche selection, session management within projects, prompt listing per project
4. **Calendar** - 111 seeded events for 2026, month navigation, type/niche filters, color-coded event types (holiday/seasonal/awareness/commercial), prompt generation per event
5. **My Prompts** - Search, filter (product/niche/favorites), sort, bulk select, bulk export (JSON/TXT), bulk delete, edit dialog, copy, duplicate, favorite toggle

## Tech Stack
- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM with SQLite
- z-ai-web-dev-sdk for AI prompt generation
- Lucide React icons
- Responsive design with mobile bottom nav + sheet sidebar
