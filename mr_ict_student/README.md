# Mr ICT Student

Mr ICT Student is a concept React + Tailwind demo that showcases a Ghanaian-focused interactive video coding journey inspired by Scrimba. The project includes a landing page, authentication screens, an onboarding wizard, and student-facing in-app experiences such as dashboards, course catalog, lesson player, sandbox, assessments, community, and roadmap views. Everything uses static demo data so that stakeholders can click through the core learner story end-to-end without a backend.

## Getting Started

```bash
npm install
npm run dev
```

The app runs on [http://localhost:5173](http://localhost:5173) by default. Use the following demo credentials when prompted:

- **Email:** `kwame@example.com`
- **Password:** `mrictdemo`

After signing up or signing in, follow the onboarding steps to unlock the dashboard and rest of the experience. Theme toggles and mock navigation work across the entire flow.

## Tech Stack Highlights

- **Vite + React 19 + TypeScript** for the application shell.
- **Tailwind CSS 3** with custom palettes inspired by Ghanaian design elements.
- **React Router** for routing through landing, auth, onboarding, and protected app views.
- **Context providers** for theme management (light/dark) and simulated student journey state, including localStorage persistence.

Because this is a static demo, all data (courses, assessments, community posts, etc.) lives in `src/data/mockData.ts`. Update those structures to adjust the narrative or to add additional sample content.

## Available Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – type-check and build the production bundle.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run the generated ESLint configuration.

## Project Structure

```
src/
  components/   # Shared UI pieces like stat cards, navigation, and announcements
  context/      # Theme and student journey providers
  data/         # Static Ghanaian-focused mock data
  layouts/      # Shell layout for authenticated routes
  pages/        # Landing, auth, onboarding, and in-app experiences
  utils/        # Small helpers for formatting values
```

Feel free to adapt the visuals or copy as the product vision evolves.
