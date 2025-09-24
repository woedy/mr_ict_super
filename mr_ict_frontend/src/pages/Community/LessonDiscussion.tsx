import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LessonComment,
  fetchLessonComments,
  postLessonComment,
  toggleCommentLike,
} from '../../services/studentExperience';

const LessonDiscussion = () => {
  const { lessonId = '' } = useParams();
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await fetchLessonComments(lessonId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load discussion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      setSubmitting(true);
      const comment = await postLessonComment(lessonId, body.trim());
      setComments((prev) => [comment, ...prev]);
      setBody('');
    } catch (err) {
      console.error(err);
      setError('Unable to post your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: number) => {
    try {
      const response = await toggleCommentLike(commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, liked: response.liked, like_count: response.like_count }
            : {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId ? { ...reply, liked: response.liked, like_count: response.like_count } : reply,
                ),
              },
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading discussion…</div>;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Lesson Discussion</h1>
        <p className="mt-2 text-sm text-slate-600">Share tips, ask questions, and support classmates learning this lesson.</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        <label className="block text-sm font-medium text-slate-700" htmlFor="comment">
          Add your comment
        </label>
        <textarea
          id="comment"
          className="mt-2 w-full rounded-md border border-slate-200 p-3 text-sm"
          rows={4}
          placeholder="What resonated with you? Where do you need help?"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={submitting || !body.trim()}
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <section className="space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">No comments yet. Start the conversation!</div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-lg bg-white p-6 shadow">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{comment.student.name}</p>
                  <p className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() => handleToggleLike(comment.id)}
                >
                  {comment.liked ? 'Unlike' : 'Like'} ({comment.like_count})
                </button>
              </header>
              <p className="mt-3 text-sm text-slate-700">{comment.body}</p>

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l border-slate-100 pl-4 text-sm text-slate-600">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="rounded-md bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{reply.student.name}</p>
                          <p className="text-xs text-slate-500">{new Date(reply.created_at).toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                          onClick={() => handleToggleLike(reply.id)}
                        >
                          {reply.liked ? 'Unlike' : 'Like'} ({reply.like_count})
                        </button>
                      </div>
                      <p className="mt-2 text-sm">{reply.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default LessonDiscussion;
