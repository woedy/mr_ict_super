import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AssessmentAttemptResult,
  AssessmentDetail,
  AssessmentQuestion,
  fetchAssessmentDetail,
  submitAssessmentAttempt,
} from '../../services/studentExperience';
import { trackLearningEvent } from '../../services/analytics';

const defaultAnswer = (question: AssessmentQuestion): string | string[] | boolean | null => {
  if (question.question_type === 'multiple_choice') {
    return '';
  }
  if (question.question_type === 'true_false') {
    return '';
  }
  return '';
};

const TakeAssessment = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | string[] | boolean | null>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentAttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAssessmentDetail(slug);
        setAssessment(data);
        const initial: Record<number, string | string[] | boolean | null> = {};
        data.questions.forEach((question) => {
          initial[question.id] = defaultAnswer(question);
        });
        setAnswers(initial);
        setStartedAt(new Date().toISOString());
        trackLearningEvent({
          event_type: 'assessment_started',
          assessment_slug: data.slug,
          metadata: {
            course_title: data.course_title,
            lesson_title: data.lesson_title,
            is_practice: data.is_practice,
          },
        });
      } catch (err) {
        setError('Unable to load assessment. Please return and try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const totalPoints = useMemo(() => {
    if (!assessment) return 0;
    return assessment.questions.reduce((sum, q) => sum + q.points, 0);
  }, [assessment]);

  const handleAnswerChange = (question: AssessmentQuestion, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!assessment) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      Object.entries(answers).forEach(([questionId, value]) => {
        payload[questionId] = value;
      });
      const attempt = await submitAssessmentAttempt(assessment.slug, {
        answers: payload,
        started_at: startedAt,
      });
      setResult(attempt);
      setAssessment({ ...assessment, attempts_remaining: attempt.attempts_remaining });
    } catch (err) {
      setError('Unable to submit assessment. Please review your answers and try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading assessment…</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => navigate('/assessments')}
        >
          Back to assessments
        </button>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{assessment.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{assessment.description || 'Review the lesson and answer the questions below.'}</p>
            <dl className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-3">
              <div>
                <dt>Passing score</dt>
                <dd>{assessment.passing_score}%</dd>
              </div>
              <div>
                <dt>Total points</dt>
                <dd>{totalPoints}</dd>
              </div>
              <div>
                <dt>Attempts remaining</dt>
                <dd>{assessment.max_attempts === 0 ? 'Unlimited' : assessment.attempts_remaining}</dd>
              </div>
            </dl>
          </div>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600"
            onClick={() => navigate('/assessments')}
          >
            Back
          </button>
        </div>
      </header>

      {result && (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <h2 className="text-lg font-semibold">Attempt submitted</h2>
          <p className="mt-2">
            Score: <strong>{result.score}</strong> ({result.percentage}%){' '}
            {result.status === 'passed' ? 'Great job!' : 'Keep practicing and try again.'}
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <div>
              <span className="text-xs uppercase text-emerald-600">XP Awarded</span>
              <p className="font-semibold">{result.awarded_xp}</p>
            </div>
            {result.badge && (
              <div>
                <span className="text-xs uppercase text-emerald-600">Badge</span>
                <p className="font-semibold">{result.badge.name}</p>
              </div>
            )}
            {result.certificate && (
              <div>
                <span className="text-xs uppercase text-emerald-600">Certificate</span>
                <p className="font-semibold">{result.certificate.title}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {assessment.questions.map((question, index) => (
          <section key={question.id} className="rounded-lg bg-white p-6 shadow">
            <header className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Question {index + 1}</span>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{question.question_text}</h2>
                <p className="mt-1 text-xs text-slate-500">Worth {question.points} point{question.points === 1 ? '' : 's'}</p>
              </div>
            </header>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {question.question_type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => handleAnswerChange(question, event.target.value)}
                        className="h-4 w-4"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'true_false' && (
                <div className="space-y-2">
                  {['True', 'False'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => handleAnswerChange(question, event.target.value)}
                        className="h-4 w-4"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'free_response' && (
                <textarea
                  className="w-full rounded-md border border-slate-200 p-3 text-sm"
                  rows={4}
                  value={(answers[question.id] as string) || ''}
                  onChange={(event) => handleAnswerChange(question, event.target.value)}
                  placeholder="Type your answer here"
                  required
                />
              )}
            </div>
          </section>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600"
            onClick={() => navigate('/assessments')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={submitting || (assessment.max_attempts !== 0 && assessment.attempts_remaining === 0)}
          >
            {submitting ? 'Submitting…' : 'Submit attempt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeAssessment;
