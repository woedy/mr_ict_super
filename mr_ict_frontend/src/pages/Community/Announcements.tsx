import { useEffect, useState } from 'react';
import { Announcement, fetchAnnouncements } from '../../services/studentExperience';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load announcements at the moment.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading announcements…</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-white p-6 text-red-600 shadow">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Community Announcements</h1>
        <p className="mt-2 text-sm text-slate-600">
          Stay up to date with the latest news from the Mr ICT team — new lessons, live events, and school-wide
          celebrations.
        </p>
      </header>

      {announcements.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">No announcements yet. Check back soon!</div>
      ) : (
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{announcement.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {announcement.course_title ? `Course: ${announcement.course_title}` : 'All students'} ·{' '}
                    {new Date(announcement.published_at).toLocaleString()}
                  </p>
                </div>
                {announcement.is_pinned && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pinned</span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{announcement.body}</p>
              {announcement.published_by_name && (
                <p className="mt-3 text-xs text-slate-500">Posted by {announcement.published_by_name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
