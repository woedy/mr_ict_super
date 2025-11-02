export type LessonVersionMarker = {
  id: string
  label: string
  timecode: string
  position: number
  type: 'commit' | 'comment' | 'checkpoint'
}

export type Lesson = {
  id: string
  title: string
  duration: string
  type: 'video' | 'project' | 'quiz' | 'reflection'
  summary: string
  interactiveCode?: string
  interactiveNotes?: string
  versionMarkers?: LessonVersionMarker[]
  previewImage?: string
}

export type Module = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Course = {
  id: string
  title: string
  subtitle: string
  summary: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  track: 'Web' | 'Data' | 'Design'
  xp: number
  hours: number
  color: string
  heroImage: string
  tags: string[]
  spotlight: string
  modules: Module[]
  instructors: Array<{
    name: string
    avatar: string
    title: string
  }>
}

export type Assessment = {
  id: string
  title: string
  courseId: string
  type: 'Checkpoint' | 'Capstone' | 'Sprint Challenge'
  duration: string
  attemptsLeft: number
  dueDate: string
  xp: number
  focus: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  date: string
  icon: string
  link?: string
}

export type CommunityThread = {
  id: string
  title: string
  author: string
  avatar: string
  courseId: string
  replies: number
  lastActivity: string
  excerpt: string
  tags: string[]
}

export type PracticeChallenge = {
  id: string
  title: string
  courseId: string
  difficulty: 'Starter' | 'Core' | 'Stretch'
  estimatedMinutes: number
  description: string
}

export type StudentProfile = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  location: string
  school: string
  track: string
  xp: number
  streak: number
  badges: number
  language: string
  availability: string
  learningGoals: string
  interests: string[]
  accessibility: string[]
  preferredMode: 'online' | 'offline' | 'hybrid'
}

export const demoStudentProfile: StudentProfile = {
  id: 'student-kwame',
  fullName: 'Kwame Mensah',
  firstName: 'Kwame',
  lastName: 'Mensah',
  email: 'kwame@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  location: 'Cape Coast, Ghana',
  school: 'Wesley Grammar Senior High',
  track: 'Web',
  xp: 18250,
  streak: 12,
  badges: 8,
  language: 'English',
  availability: 'Evenings & Weekends',
  learningGoals: 'Build polished portfolio projects and prepare for NSS placements.',
  interests: ['Front-end design', 'Inclusive digital literacy', 'Afrofuturist storytelling'],
  accessibility: ['Live captions', 'Offline downloads'],
  preferredMode: 'hybrid',
}

export const courses: Course[] = [
  {
    id: 'foundations-web',
    title: 'Creative Web Foundations',
    subtitle: 'Craft colourful, accessible experiences for learners across Ghana and Africa.',
    summary:
      'Blend HTML, CSS, and inclusive design to build experiences tuned for West African devices, data realities, and students.',
    level: 'Beginner',
    track: 'Web',
    xp: 2400,
    hours: 18,
    color: 'from-primary-400 via-accent-400 to-primary-600',
    heroImage: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    tags: ['HTML', 'CSS', 'Inclusive Design'],
    spotlight: 'Design for low bandwidth, readability in bright classrooms, and cultural relevance.',
    modules: [
      {
        id: 'module-1',
        title: 'Setting the Stage',
        lessons: [
          {
            id: 'welcome',
            title: 'Welcome to Creative Web Foundations',
            duration: '7:40',
            type: 'video',
            summary: 'Meet your mentors and peek at showcase projects from ICT clubs across Ghana and Africa.',
            previewImage:
              'https://images.unsplash.com/photo-1526285371233-37388c84c63c?auto=format&fit=crop&w=1200&q=80',
            interactiveCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Kwame's Innovation Lab</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: 'Poppins', system-ui, sans-serif;
        background: linear-gradient(135deg, #fef3c7, #fce7f3);
        margin: 0;
        padding: 0;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at 10% 20%, rgba(244, 114, 182, 0.25), transparent 60%),
          radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.2), transparent 55%),
          #0f172a;
        color: #f8fafc;
      }
      .stage {
        width: min(960px, 92vw);
        border-radius: 40px;
        padding: 48px;
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 32px 80px rgba(15, 23, 42, 0.65);
      }
      h1 {
        margin: 0 0 8px;
        font-size: clamp(2.5rem, 4vw, 3.8rem);
        letter-spacing: -0.03em;
      }
      p {
        max-width: 60ch;
        line-height: 1.7;
        color: rgba(226, 232, 240, 0.9);
        font-size: 1.05rem;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        background: rgba(14, 165, 233, 0.18);
        color: #38bdf8;
        font-size: 0.9rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .pill span {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(135deg, #fbbf24, #f97316);
        box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
      }
      .cta {
        display: inline-flex;
        gap: 0.75rem;
        align-items: center;
        margin-top: 2.5rem;
        padding: 0.9rem 1.6rem;
        border-radius: 9999px;
        background: linear-gradient(135deg, #f97316, #facc15);
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 22px 45px rgba(249, 115, 22, 0.35);
      }
      footer {
        margin-top: 40px;
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        font-size: 0.95rem;
        color: rgba(148, 163, 184, 0.95);
      }
      footer strong {
        color: #fbbf24;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <article class="stage">
      <div class="pill"><span></span> Ghana & Africa Creative Tech Studio</div>
      <h1>Design a welcome hero students feel inside</h1>
      <p>Work alongside <strong>Esi</strong> as she introduces the studio culture, community rituals, and the challenge you'll remix by the end of the lesson.</p>
      <a class="cta" href="#">Launch studio tour →</a>
      <footer>
        <div>Made with love for <strong>Cape Coast ICT Lab</strong></div>
        <div>Offline friendly • Twi voiceover available</div>
      </footer>
    </article>
  </body>
</html>
`,
            versionMarkers: [
              { id: 'sketch', label: 'Storyboard intro', timecode: '00:12', position: 6, type: 'comment' },
              { id: 'structure', label: 'Structure HTML', timecode: '02:45', position: 36, type: 'commit' },
              { id: 'style', label: 'Apply glassmorphism', timecode: '05:18', position: 64, type: 'commit' },
              { id: 'wrap', label: 'Recap & save', timecode: '07:08', position: 88, type: 'checkpoint' },
            ],
          },
          {
            id: 'devices',
            title: 'Designing for Shared Devices',
            duration: '10:12',
            type: 'video',
            summary: 'Strategies for learning labs where keyboards are shared and data is precious.',
          },
          {
            id: 'html-forms',
            title: 'Inclusive HTML Forms',
            duration: '15:06',
            type: 'project',
            summary: 'Build a community noticeboard form that supports keyboard-only navigation.',
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Colour & Typography for the Tropics',
        lessons: [
          {
            id: 'colour-palettes',
            title: 'Colour Palettes Inspired by Adinkra',
            duration: '11:24',
            type: 'video',
            summary: 'Use African symbolism and Ghanaian Adinkra to influence accessible colour systems.',
          },
          {
            id: 'responsive-grid',
            title: 'Responsive Grids for Mobile-First Schools',
            duration: '14:32',
            type: 'project',
            summary: 'Prototype a responsive homepage for a community ICT hub.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Esi Quansah',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        title: 'Design Mentor · Accra',
      },
      {
        name: 'Yaw Boateng',
        avatar: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
        title: 'Front-end Coach · Kumasi',
      },
    ],
  },
  {
    id: 'data-storytelling',
    title: 'Data Storytelling with African Open Data',
    subtitle: 'Turn raw statistics into narratives communities can trust.',
    summary:
      'Learn to analyse, visualise, and communicate public data sets about health, climate, and education using Python.',
    level: 'Intermediate',
    track: 'Data',
    xp: 3200,
    hours: 22,
    color: 'from-emerald-400 via-primary-500 to-emerald-600',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Python', 'DataViz', 'Civic Tech'],
    spotlight: 'Collaborate with district assemblies to translate data into community action.',
    modules: [
      {
        id: 'module-1',
        title: 'Responsible Data Foundations',
        lessons: [
          {
            id: 'context',
            title: 'The Story Behind the Numbers',
            duration: '9:38',
            type: 'video',
            summary: 'Understand bias, cultural nuance, and storytelling ethics.',
          },
          {
            id: 'python-refresh',
            title: 'Python Refresh with African Postal Datasets',
            duration: '18:40',
            type: 'project',
            summary: 'Use notebooks to clean and join postal region data sets.',
          },
          {
            id: 'community-brief',
            title: 'Community Brief Sprint',
            duration: '25:10',
            type: 'reflection',
            summary: 'Present insights to a mock PTA and gather feedback.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Naana Kusi',
        avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
        title: 'Data Journalist · Cape Coast',
      },
    ],
  },
  {
    id: 'immersive-media',
    title: 'Immersive Media Studio',
    subtitle: 'Blend video, code, and storytelling to teach ICT through interactive experiences.',
    summary:
      'Produce interactive video experiences that pair timeline-based code editing with locally resonant storytelling.',
    level: 'Advanced',
    track: 'Design',
    xp: 4100,
    hours: 26,
    color: 'from-purple-500 via-accent-400 to-rose-500',
    heroImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Motion Design', 'Video Production', 'Web Components'],
    spotlight: 'Prototype collaborative lessons for ICT clubs and community hubs.',
    modules: [
      {
        id: 'module-1',
        title: 'Interactive Lesson Architecture',
        lessons: [
          {
            id: 'story-structure',
            title: 'Story Structure for Interactive Lessons',
            duration: '12:12',
            type: 'video',
            summary: 'Craft arcs that keep students coding along with the narrative.',
          },
          {
            id: 'timeline-tools',
            title: 'Timeline Editing Workflows',
            duration: '19:47',
            type: 'project',
            summary: 'Build a multi-track timeline using open-source video tooling.',
          },
          {
            id: 'accessibility-pass',
            title: 'Accessibility QA Walkthrough',
            duration: '16:05',
            type: 'quiz',
            summary: 'Evaluate keyboard shortcuts and caption timing for your prototype.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Abena Owusu',
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80',
        title: 'Interactive Producer · Tamale',
      },
    ],
  },
]

export const enrollments = [
  {
    courseId: 'foundations-web',
    progress: 42,
    lastLessonId: 'html-forms',
  },
  {
    courseId: 'data-storytelling',
    progress: 18,
    lastLessonId: 'python-refresh',
  },
]

export const assessments: Assessment[] = [
  {
    id: 'checkpoint-web-1',
    title: 'Web Foundations Sprint Checkpoint',
    courseId: 'foundations-web',
    type: 'Checkpoint',
    duration: '35 min',
    attemptsLeft: 2,
    dueDate: 'Due Sunday · 6:00 PM',
    xp: 350,
    focus: 'Semantic HTML, forms, and inclusive navigation patterns.',
  },
  {
    id: 'capstone-data',
    title: 'Data Storytelling Capstone Brief',
    courseId: 'data-storytelling',
    type: 'Capstone',
    duration: '90 min',
    attemptsLeft: 1,
    dueDate: 'Opens Nov 12',
    xp: 900,
    focus: 'Craft a community-ready briefing with charts and narration.',
  },
]

export const announcements: Announcement[] = [
  {
    id: 'announce-1',
    title: 'Campus Innovation Fair Submissions',
    body: 'Submit your interactive demo by 15 Nov to qualify for the Accra finals showcase.',
    date: '2h ago',
    icon: '🎤',
    link: '#',
  },
  {
    id: 'announce-2',
    title: 'New Offline Packs Available',
    body: 'Download updated lesson bundles for community labs with limited connectivity.',
    date: '1 day ago',
    icon: '📦',
  },
]

export const communityThreads: CommunityThread[] = [
  {
    id: 'thread-1',
    title: 'How are you organising peer review in your ICT club?',
    author: 'Afi Baidoo',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    courseId: 'foundations-web',
    replies: 14,
    lastActivity: '25 mins ago',
    excerpt: 'We started a Friday-night design review circle at the Cape Coast hub — sharing templates here!',
    tags: ['Clubs', 'Teaching Tips'],
  },
  {
    id: 'thread-2',
    title: 'Visualising BECE results for community forums',
    author: 'Kwesi Aning',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
    courseId: 'data-storytelling',
    replies: 9,
    lastActivity: '1 hr ago',
    excerpt: 'Looking for inspiration to communicate data to non-technical parents. Here is my draft dashboard.',
    tags: ['DataViz', 'Community'],
  },
]

export const practiceChallenges: PracticeChallenge[] = [
  {
    id: 'challenge-grid',
    title: 'Design a School Landing Page Grid',
    courseId: 'foundations-web',
    difficulty: 'Core',
    estimatedMinutes: 40,
    description: 'Use CSS grid and African-inspired palettes to highlight school achievements.',
  },
  {
    id: 'challenge-dataviz',
    title: 'Chart Rural Connectivity Progress',
    courseId: 'data-storytelling',
    difficulty: 'Stretch',
    estimatedMinutes: 55,
    description: 'Build a multi-series chart that works offline and exports to PNG for PTA meetings.',
  },
]

export const dailyFocus = {
  date: 'Friday, 31 October',
  win: 'Shipped the Adinkra-inspired dashboard layout in the Web Foundations studio. ✨',
  intention: 'Complete the accessibility QA for your community noticeboard project.',
  encouragement: 'Remember, every inclusive detail keeps more learners across Ghana and Africa engaged.',
}

export const upcomingSessions = [
  {
    id: 'session-1',
    title: 'Live Studio: Storyboarding with Low-bandwidth in Mind',
    mentor: 'Hosted by Abena',
    schedule: 'Today · 5:30 PM GMT',
  },
  {
    id: 'session-2',
    title: 'Study Circle: Python Visualisations with Flourish',
    mentor: 'Led by Naana',
    schedule: 'Sat · 10:00 AM GMT',
  },
]

export const journeyTimeline = [
  {
    id: 'moment-1',
    label: 'Signed up',
    description: 'Joined Mr ICT Student to explore interactive video coding for JHS and SHS classrooms across Ghana and Africa.',
    timestamp: '4 weeks ago',
  },
  {
    id: 'moment-2',
    label: 'Earned Inclusive Web Badge',
    description: 'Completed the accessible noticeboard project and peer review.',
    timestamp: '12 days ago',
  },
  {
    id: 'moment-3',
    label: 'First Community Workshop',
    description: 'Facilitated a Saturday ICT club session using the offline sandbox.',
    timestamp: '5 days ago',
  },
]
