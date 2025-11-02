# Mr ICT Admin Portal v2

Admin dashboard for managing the Mr ICT interactive coding platform for JHS and SHS students across Ghana and Africa.

## Features

### Implemented
- **Dashboard**: Platform overview with real-time stats, user activity, and course performance
- **User Management**: View, filter, and manage students, instructors, and admins
- **Course Management**: Create, edit, and publish courses with detailed analytics
- **Recording Studio**: Interactive video recording interface with:
  - Live code editing with Monaco Editor
  - Real-time preview
  - Timeline markers
  - Camera and microphone controls
  - Multi-file support (HTML, CSS, Notes)
- **Theme System**: Full light/dark mode support
- **Responsive Design**: Works on all screen sizes

### Coming Soon
- Challenges Management
- Community Moderation
- Analytics Dashboard
- Settings & Configuration

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Monaco Editor** for code editing
- **Heroicons** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Sidebar.tsx
│   ├── TopNavigation.tsx
│   └── ThemeToggle.tsx
├── context/         # React context providers
│   └── ThemeContext.tsx
├── data/            # Mock data and types
│   └── mockData.ts
├── layouts/         # Page layouts
│   └── AdminLayout.tsx
├── pages/           # Page components
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   ├── CoursesPage.tsx
│   └── RecordingStudioPage.tsx
└── App.tsx          # Main app component
```

## Development

The app runs on `http://localhost:5174` (or next available port).

All data is currently mocked in `src/data/mockData.ts`. No backend connections yet.

## Design Philosophy

- **Admin-first**: Designed specifically for platform administrators
- **Intuitive**: Clean, modern UI inspired by the student app
- **Efficient**: Quick access to all management functions
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Responsive**: Works seamlessly on desktop, tablet, and mobile

## Recording Studio

The Recording Studio is a full-screen interface for creating interactive coding tutorials:

- **Split View**: Code editor on left, live preview on right
- **File Tabs**: Switch between HTML, CSS, and notes
- **Timeline Markers**: Add bookmarks at key moments
- **Recording Controls**: Start/pause/stop with duration tracking
- **Input Management**: Toggle camera and microphone
- **Undo/Redo**: Full editing history

## Color Palette

- **Primary**: Teal (#1f8f7a) - Main brand color
- **Accent**: Orange (#ffb151) - Highlights and CTAs
- **Neutral**: Slate - Backgrounds and text
- **Success**: Emerald - Positive actions
- **Warning**: Amber - Cautions
- **Error**: Red - Destructive actions

## Contributing

This is part of the Mr ICT platform. Follow the main project guidelines in `AGENTS.md`.

---

Made in Ghana for Africa 🇬🇭 🌍
