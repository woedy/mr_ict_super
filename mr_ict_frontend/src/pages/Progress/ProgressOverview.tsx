import { useEffect, useState } from 'react';
import { ProgressSummary, fetchProgressSummary } from '../../services/studentExperience';

const ProgressOverview = () => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProgressSummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load your progress summary.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading progress…</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-white p-6 text-red-600 shadow">{error}</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Progress & Rewards</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track your XP, badges, certificates, and recent assessment attempts. Keep building your streak to unlock new
          rewards.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="text-sm font-semibold text-slate-500">Total XP</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.xp.total}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="text-sm font-semibold text-slate-500">Badges Earned</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.badges.length}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="text-sm font-semibold text-slate-500">Certificates</h2>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.certificates.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Recent XP events</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {summary.xp.events.length === 0 && <li>No XP events yet — complete assessments and challenges to earn XP!</li>}
            {summary.xp.events.map((event) => (
              <li key={event.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{event.description || event.source}</p>
                  <p className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
                </div>
                <span className="font-semibold text-emerald-600">+{event.amount}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Recent assessments</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {summary.recent_assessments.length === 0 && (
              <li>No assessment attempts yet — explore the assessments tab to get started.</li>
            )}
            {summary.recent_assessments.map((attempt) => (
              <li key={attempt.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{attempt.assessment.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(attempt.completed_at).toLocaleString()} · {attempt.status.toUpperCase()}
                  </p>
                </div>
                <span className="font-semibold text-primary">{attempt.percentage}%</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Badges</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {summary.badges.length === 0 && <li className="text-sm text-slate-600">No badges yet — complete challenges to unlock them.</li>}
            {summary.badges.map((badge) => (
              <li key={badge.id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">{badge.name || 'Badge unlocked'}</p>
                <p className="text-xs text-slate-500">{badge.criteria || 'Criteria unavailable'}</p>
                <p className="mt-2 text-xs text-slate-400">Earned {new Date(badge.earned_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Certificates</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {summary.certificates.length === 0 && <li>No certificates issued yet.</li>}
            {summary.certificates.map((certificate) => (
              <li key={certificate.id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">{certificate.title}</p>
                <p className="text-xs text-slate-500">Issued {new Date(certificate.issued_at).toLocaleDateString()}</p>
                {certificate.download_url && (
                  <a
                    className="mt-2 inline-block text-xs font-semibold text-primary"
                    href={certificate.download_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download certificate
                  </a>
                )}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

export default ProgressOverview;
