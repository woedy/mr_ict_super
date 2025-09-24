import { useEffect, useMemo, useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  ChallengeDetail,
  ChallengeSummary,
  RunResult,
  SandboxFile,
  SubmitResult,
  autosaveChallenge,
  fetchChallenge,
  fetchChallenges,
  requestHint,
  resetChallenge,
  runChallenge,
  submitChallenge,
} from '../../services/codingSandbox';

const defaultMessage = 'Select a challenge to load the interactive workspace.';

const getLanguage = (file: SandboxFile | undefined) => {
  if (!file?.name) return 'plaintext';
  if (file.name.endsWith('.py')) return 'python';
  if (file.name.endsWith('.ts')) return 'typescript';
  if (file.name.endsWith('.js')) return 'javascript';
  if (file.name.endsWith('.css')) return 'css';
  if (file.name.endsWith('.html')) return 'html';
  return file.language || 'plaintext';
};

const CodingSandbox = () => {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detail, setDetail] = useState<ChallengeDetail | null>(null);
  const [files, setFiles] = useState<SandboxFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [diffMode, setDiffMode] = useState(false);
  const [stdin, setStdin] = useState('');

  useEffect(() => {
    let mounted = true;
    const initialise = async () => {
      try {
        const challengeList = await fetchChallenges();
        if (!mounted) return;
        setChallenges(challengeList);
        if (challengeList.length && !selectedSlug) {
          setSelectedSlug(challengeList[0].slug);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Unable to load challenges.');
      }
    };
    initialise();
    return () => {
      mounted = false;
    };
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) {
      setDetail(null);
      setFiles([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    const loadDetail = async () => {
      try {
        const challenge = await fetchChallenge(selectedSlug);
        if (!mounted) return;
        setDetail(challenge);
        setFiles(challenge.current_files);
        setActiveFileIndex(0);
        setRunResult(null);
        setSubmitResult(null);
        setHintMessage(null);
      } catch (err: any) {
        if (!mounted) return;
        const message = err?.response?.data?.detail || err?.message || 'Failed to load challenge.';
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [selectedSlug]);

  const activeFile = files[activeFileIndex];
  const starterFile = useMemo(() => {
    if (!detail) return undefined;
    const current = detail.starter_files.find(file => file.name === activeFile?.name);
    return current ?? detail.starter_files[activeFileIndex];
  }, [detail, activeFile, activeFileIndex]);

  const updateFileContent = (index: number, content: string | undefined) => {
    if (content === undefined) return;
    setFiles(prev => {
      const next = [...prev];
      next[index] = { ...next[index], content };
      return next;
    });
    setSaveStatus('idle');
  };

  const handleAutosave = async () => {
    if (!selectedSlug) return;
    try {
      setSaveStatus('saving');
      await autosaveChallenge(selectedSlug, files);
      setSaveStatus('saved');
    } catch (err: any) {
      setSaveStatus('idle');
      const message = err?.response?.data?.detail || err?.message || 'Failed to save code.';
      setError(message);
    }
  };

  const handleRun = async () => {
    if (!selectedSlug) return;
    try {
      setRunning(true);
      const result = await runChallenge(selectedSlug, { files, stdin: stdin || undefined });
      setRunResult(result);
      setSubmitResult(null);
      setFiles(result.files);
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Unable to run code.';
      setError(message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlug) return;
    try {
      setRunning(true);
      const result = await submitChallenge(selectedSlug, { files });
      setSubmitResult(result);
      if (result.solution_files) {
        setDetail(prev => (prev ? { ...prev, solution_files: result.solution_files, solution_available: true } : prev));
      }
      setFiles(result.files);
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Submission failed.';
      setError(message);
    } finally {
      setRunning(false);
    }
  };

  const handleHint = async () => {
    if (!selectedSlug) return;
    try {
      const result = await requestHint(selectedSlug);
      setHintMessage(result.hint);
      setDetail(prev =>
        prev
          ? {
              ...prev,
              hints: {
                revealed: result.revealed,
                remaining: result.remaining,
              },
            }
          : prev,
      );
    } catch (err: any) {
      const detailMessage = err?.response?.data?.detail;
      const retryIn = err?.response?.data?.retry_in;
      if (detailMessage && retryIn) {
        setHintMessage(`${detailMessage} Try again in ${retryIn} seconds.`);
      } else {
        setHintMessage(detailMessage || err?.message || 'Unable to fetch a hint.');
      }
    }
  };

  const handleReset = async () => {
    if (!selectedSlug) return;
    try {
      const result = await resetChallenge(selectedSlug);
      setFiles(result.files);
      setRunResult(null);
      setSubmitResult(null);
      setHintMessage(null);
      setSaveStatus('idle');
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Unable to reset workspace.';
      setError(message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur lg:w-80 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Practice Challenges</h2>
            {saveStatus === 'saving' && <span className="text-xs text-amber-500">Saving…</span>}
            {saveStatus === 'saved' && <span className="text-xs text-emerald-500">Saved</span>}
          </div>
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-2">
            {challenges.map(item => (
              <li key={item.slug}>
                <button
                  onClick={() => setSelectedSlug(item.slug)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedSlug === item.slug
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-slate-100 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{item.title}</span>
                    {item.is_completed && <span className="rounded-full bg-emerald-500/20 px-2 text-xs text-emerald-700">Done</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Difficulty: {item.difficulty}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          {loading && <div className="flex h-full items-center justify-center text-slate-500">Loading challenge…</div>}
          {!loading && !detail && <div className="text-slate-500">{error || defaultMessage}</div>}
          {!loading && detail && (
            <div className="flex h-full flex-col gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{detail.title}</h1>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {detail.instructions}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAutosave}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
                  disabled={saveStatus === 'saving'}
                >
                  Save progress
                </button>
                <button
                  onClick={handleRun}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                  disabled={running}
                >
                  Run code
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/40"
                  disabled={running}
                >
                  Submit tests
                </button>
                <button
                  onClick={handleHint}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                >
                  Reveal hint
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Reset
                </button>
                <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={diffMode}
                    onChange={event => setDiffMode(event.target.checked)}
                  />
                  Show diff
                </label>
              </div>

              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <div className="flex h-[420px] flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2 border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
                    {files.map((file, index) => (
                      <button
                        key={file.name}
                        onClick={() => {
                          setActiveFileIndex(index);
                          setDiffMode(false);
                        }}
                        className={`rounded px-3 py-1 text-sm font-medium transition ${
                          index === activeFileIndex
                            ? 'bg-white text-primary shadow dark:bg-slate-900'
                            : 'text-slate-600 hover:text-primary dark:text-slate-300'
                        }`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    {diffMode && activeFile && starterFile ? (
                      <DiffEditor
                        original={starterFile.content}
                        modified={activeFile.content}
                        language={getLanguage(activeFile)}
                        options={{ renderSideBySide: true, readOnly: true, minimap: { enabled: false } }}
                        height="100%"
                      />
                    ) : (
                      <Editor
                        value={activeFile?.content}
                        language={getLanguage(activeFile)}
                        onChange={value => updateFileContent(activeFileIndex, value || '')}
                        height="100%"
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          automaticLayout: true,
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-80">
                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Input (stdin)</h3>
                    <textarea
                      value={stdin}
                      onChange={event => setStdin(event.target.value)}
                      placeholder="Enter custom input"
                      className="mt-2 h-24 w-full rounded border border-slate-300 bg-white p-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-600 dark:bg-slate-900"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Output</h3>
                    {runResult ? (
                      <div className="mt-2 space-y-1">
                        <p className="rounded bg-slate-900/90 p-2 font-mono text-xs text-emerald-200">
                          {runResult.stdout || 'No output'}
                        </p>
                        {runResult.stderr && (
                          <p className="rounded bg-rose-900/80 p-2 font-mono text-xs text-rose-100">{runResult.stderr}</p>
                        )}
                        {runResult.timed_out && <p className="text-xs text-rose-500">Execution timed out.</p>}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Run your code to see console output.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Test results</h3>
                    {submitResult ? (
                      <ul className="mt-2 space-y-2 text-xs">
                        {submitResult.cases.map((caseResult, index) => {
                          const passed = caseResult.passed as boolean;
                          return (
                            <li
                              key={caseResult.name?.toString() ?? index}
                              className={`rounded border p-2 ${
                                passed
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                  : 'border-rose-400 bg-rose-50 text-rose-600'
                              }`}
                            >
                              <div className="font-semibold">{caseResult.name as string}</div>
                              {!passed && (
                                <div className="mt-1 space-y-1 font-mono">
                                  <div>expected: {(caseResult.expected_output as string) ?? ''}</div>
                                  <div>actual: {(caseResult.actual_output as string) ?? ''}</div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Submit your code to see test case feedback.</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Hints</h3>
                    {detail.hints.revealed.length === 0 && !hintMessage && (
                      <p className="mt-2 text-xs text-slate-500">Hints will appear here.</p>
                    )}
                    <ul className="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {detail.hints.revealed.map((hint, index) => (
                        <li key={index} className="rounded bg-slate-100 p-2 dark:bg-slate-800">
                          {hint}
                        </li>
                      ))}
                    </ul>
                    {hintMessage && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{hintMessage}</p>}
                  </div>

                  {detail.solution_available && detail.solution_files && (
                    <div className="rounded-lg border border-emerald-500/50 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                      Solution unlocked! Use the diff viewer to compare your approach.
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-rose-400 bg-rose-50 p-3 text-xs text-rose-600 dark:border-rose-500 dark:bg-rose-900/30 dark:text-rose-200">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CodingSandbox;
