import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StudentProfile,
  getStudentProfile,
  updateStudentProfile,
} from '../../services/studentExperience';

const languageOptions = ['English', 'Twi', 'Ewe', 'Ga', 'French'];
const accessibilityOptions = [
  { id: 'captions', label: 'Show captions for all videos' },
  { id: 'high-contrast', label: 'Use high contrast mode' },
  { id: 'reduced-motion', label: 'Reduce animations and motion' },
  { id: 'audio-descriptions', label: 'Enable audio descriptions' },
];
const interestOptions = ['Web', 'Mobile', 'Games', 'Data', 'Electronics', 'Design'];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [allowOfflineDownloads, setAllowOfflineDownloads] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getStudentProfile();
        if (!mounted) return;
        setProfile(data);
        setPreferredLanguage(data.preferred_language || 'English');
        setAccessibility(data.accessibility_preferences || []);
        setInterests((data.interest_tags || []).map((tag) => tag.toLowerCase()));
        setAllowOfflineDownloads(data.allow_offline_downloads ?? true);
        if (data.has_completed_onboarding) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        setError('We could not load your profile. Please sign in again.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const offline = useMemo(() => typeof navigator !== 'undefined' && !navigator.onLine, []);

  const toggleAccessibility = (id: string) => {
    setAccessibility((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag].slice(0, 5),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        preferred_language: preferredLanguage,
        accessibility_preferences: accessibility,
        interest_tags: interests,
        allow_offline_downloads: allowOfflineDownloads,
        complete_onboarding: true,
      };
      const updated = await updateStudentProfile(payload);
      setSuccess('Preferences saved!');
      setProfile(updated);
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Failed to save your preferences.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="rounded-2xl bg-slate-800 px-6 py-5 shadow-xl">Loading your onboarding…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-semibold">Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!</h1>
        <p className="mt-2 text-slate-200">
          Tell us how you learn best so we can tailor lessons, challenges, and offline experiences for you.
        </p>

        {offline && (
          <div className="mt-4 rounded-xl border border-yellow-500/60 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            You&apos;re currently offline. Any changes will be saved locally and synced the next time you connect.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-400 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-green-500/60 bg-green-500/10 p-4 text-sm text-green-100">{success}</div>
        )}

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <section>
            <h2 className="text-xl font-semibold text-white">Preferred language</h2>
            <p className="mt-1 text-sm text-slate-300">
              Choose the language you&apos;re most comfortable learning in. We&apos;ll prioritise subtitles and resources in this language.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {languageOptions.map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 transition hover:bg-white/10 ${
                    preferredLanguage === option
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferred_language"
                    value={option}
                    checked={preferredLanguage === option}
                    onChange={() => setPreferredLanguage(option)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Accessibility preferences</h2>
            <p className="mt-1 text-sm text-slate-300">
              We&apos;ll remember these so every lesson is accessible from the start.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {accessibilityOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition hover:bg-white/10 ${
                    accessibility.includes(option.id)
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibility.includes(option.id)}
                    onChange={() => toggleAccessibility(option.id)}
                    className="mt-1 h-4 w-4 rounded border-white/40 bg-slate-800 text-indigo-400 focus:ring-indigo-400"
                  />
                  <span className="text-sm text-slate-100">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Pick a few interests</h2>
            <p className="mt-1 text-sm text-slate-300">
              We&apos;ll use these to recommend courses and challenges first. Choose up to five.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {interestOptions.map((option) => {
                const active = interests.includes(option.toLowerCase());
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleInterest(option.toLowerCase())}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/10 text-slate-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/20 bg-white/5 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Offline downloads</h3>
                <p className="text-sm text-slate-300">
                  When enabled, we&apos;ll cache lessons and code snippets so you can keep learning without a connection.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={allowOfflineDownloads}
                  onChange={() => setAllowOfflineDownloads((value) => !value)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-indigo-500 peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </section>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving preferences…' : 'Finish onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
