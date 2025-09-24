import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentSummary, fetchAssessments } from '../../services/studentExperience';

const statusBadge = (assessment: AssessmentSummary) => {
  if (!assessment.is_available) {
    return <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Closed</span>;
  }
  if (assessment.attempts_remaining === 0) {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Limit reached</span>;
  }
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Available</span>;
};

const formatDate = (value: string | null) => {
  if (!value) return 'No deadline';
  const date = new Date(value);
  return date.toLocaleString();
};

const AssessmentsList = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAssessments();
        setAssessments(data);
      } catch (err) {
        setError('Unable to load assessments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading assessments…</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-white p-6 text-red-600 shadow">{error}</div>;
  }

  if (assessments.length === 0) {
    return <div className="rounded-lg bg-white p-6 shadow">No assessments have been assigned yet.</div>;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Assessments</h1>
        <p className="mt-2 text-sm text-slate-600">
          Practice quizzes and graded assessments to check your understanding after each lesson. Watch your attempts and
          rewards update in real time.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assessments.map((assessment) => (
          <article key={assessment.id} className="flex flex-col justify-between rounded-lg bg-white p-5 shadow">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">{assessment.title}</h2>
                {statusBadge(assessment)}
              </div>
              <p className="text-sm text-slate-600">{assessment.description || 'No description provided.'}</p>
              <dl className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <dt>Course</dt>
                  <dd>{assessment.course_title || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Lesson</dt>
                  <dd>{assessment.lesson_title || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Passing score</dt>
                  <dd>{assessment.passing_score}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Attempts remaining</dt>
                  <dd>{assessment.max_attempts === 0 ? 'Unlimited' : assessment.attempts_remaining}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Available until</dt>
                  <dd>{formatDate(assessment.available_until)}</dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              onClick={() => navigate(`/assessments/${assessment.slug}`)}
              disabled={!assessment.is_available || assessment.attempts_remaining === 0}
            >
              {assessment.attempts_remaining === 0 ? 'Review' : 'Start Assessment'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsList;
