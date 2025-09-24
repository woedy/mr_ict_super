import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  StudentProjectDetail,
  StudentProjectSummary,
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
  publishProject,
  updateProject,
  validateProject,
} from '../../services/projectsWorkspace';
import { SandboxFile } from '../../services/codingSandbox';

const getLanguage = (file: SandboxFile | undefined) => {
  if (!file?.name) return 'plaintext';
  if (file.name.endsWith('.js')) return 'javascript';
  if (file.name.endsWith('.ts')) return 'typescript';
  if (file.name.endsWith('.css')) return 'css';
  if (file.name.endsWith('.html')) return 'html';
  return file.language || 'plaintext';
};

const Workspace = () => {
  const [projects, setProjects] = useState<StudentProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<StudentProjectDetail | null>(null);
  const [files, setFiles] = useState<SandboxFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [validation, setValidation] = useState<{ passed: boolean; details: Array<Record<string, unknown>> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (!mounted) return;
        setProjects(data);
        if (data.length && !selectedProjectId) {
          setSelectedProjectId(data[0].project_id);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Unable to fetch projects.');
      }
    };
    loadProjects();
    return () => {
      mounted = false;
    };
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) {
      setProject(null);
      setFiles([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    const loadProject = async () => {
      try {
        const data = await fetchProject(selectedProjectId);
        if (!mounted) return;
        setProject(data);
        setFiles(data.files);
        setActiveFileIndex(0);
        setValidation(data.last_validation_result ?? null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || err?.message || 'Unable to load project.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadProject();
    return () => {
      mounted = false;
    };
  }, [selectedProjectId]);

  const activeFile = files[activeFileIndex];

  const handleCreateProject = async () => {
    try {
      const detail = await createProject({ title: `Workspace ${projects.length + 1}` });
      setProjects(prev => [detail, ...prev]);
      setSelectedProjectId(detail.project_id);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to create project.');
    }
  };

  const handleDelete = async () => {
    if (!selectedProjectId) return;
    try {
      await deleteProject(selectedProjectId);
      setProjects(prev => prev.filter(item => item.project_id !== selectedProjectId));
      setSelectedProjectId(null);
      setProject(null);
      setFiles([]);
      setValidation(null);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to delete project.');
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      setSaveStatus('saving');
      const updated = await updateProject(project.project_id, { title: project.title, description: project.description, files });
      setProject(updated);
      setSaveStatus('saved');
      setProjects(prev => prev.map(item => (item.project_id === updated.project_id ? updated : item)));
      setPreviewKey(prev => prev + 1);
    } catch (err: any) {
      setSaveStatus('idle');
      setError(err?.response?.data?.detail || err?.message || 'Unable to save project.');
    }
  };

  const handlePublish = async (publish: boolean) => {
    if (!project) return;
    try {
      const summary = await publishProject(project.project_id, publish);
      setProject(prev => (prev ? { ...prev, is_published: summary.is_published } : prev));
      setProjects(prev => prev.map(item => (item.project_id === summary.project_id ? summary : item)));
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to update publish status.');
    }
  };

  const handleValidate = async () => {
    if (!project) return;
    try {
      const result = await validateProject(project.project_id, { files });
      setValidation(result);
      setProjects(prev =>
        prev.map(item =>
          item.project_id === project.project_id
            ? { ...item, last_validation_result: result, last_validated_at: new Date().toISOString() }
            : item,
        ),
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to validate project.');
    }
  };

  const combinedHtml = useMemo(() => {
    if (!files.length) return '<p>No files yet</p>';
    const htmlFile = files.find(file => file.name.toLowerCase().endsWith('.html'));
    const cssFile = files.find(file => file.name.toLowerCase().endsWith('.css'));
    const jsFile = files.find(file => file.name.toLowerCase().endsWith('.js'));
    if (!htmlFile) return '<p>Create an index.html file to preview.</p>';
    let html = htmlFile.content;
    if (cssFile) {
      if (html.includes('</head>')) {
        html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
      } else {
        html = `<style>${cssFile.content}</style>` + html;
      }
    }
    if (jsFile) {
      if (html.includes('</body>')) {
        html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
      } else {
        html = html + `<script>${jsFile.content}</script>`;
      }
    }
    return html;
  }, [files, previewKey]);

  const updateFileContent = (index: number, value: string | undefined) => {
    if (value === undefined) return;
    setFiles(prev => {
      const next = [...prev];
      next[index] = { ...next[index], content: value };
      return next;
    });
    setSaveStatus('idle');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="w-full rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 lg:w-72">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">My Projects</h2>
            <button
              onClick={handleCreateProject}
              className="rounded-lg bg-primary px-3 py-1 text-sm font-medium text-white transition hover:bg-primary/80"
            >
              New
            </button>
          </div>
          <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-2">
            {projects.map(item => (
              <li key={item.project_id}>
                <button
                  onClick={() => setSelectedProjectId(item.project_id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedProjectId === item.project_id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-slate-100 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    {item.is_published && <span className="rounded-full bg-emerald-500/20 px-2 text-xs text-emerald-700">Live</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Updated {new Date(item.updated_at).toLocaleDateString()}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          {loading && <div className="flex h-full items-center justify-center text-slate-500">Loading project…</div>}
          {!loading && !project && <div className="text-slate-500">Select or create a project to begin editing.</div>}
          {!loading && project && (
            <div className="flex h-full flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <input
                    value={project.title}
                    onChange={event => setProject(prev => (prev ? { ...prev, title: event.target.value } : prev))}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-lg font-semibold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <textarea
                    value={project.description ?? ''}
                    onChange={event => setProject(prev => (prev ? { ...prev, description: event.target.value } : prev))}
                    placeholder="Describe what you are building."
                    className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {saveStatus === 'saving' && <span className="text-xs text-amber-500">Saving…</span>}
                  {saveStatus === 'saved' && <span className="text-xs text-emerald-500">Saved</span>}
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleValidate}
                    className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                  >
                    Validate
                  </button>
                  <button
                    onClick={() => handlePublish(!project.is_published)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      project.is_published
                        ? 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                        : 'border border-slate-400 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {project.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg border border-rose-400 px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 lg:flex-row">
                <div className="flex h-[420px] flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2 border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
                    {files.map((file, index) => (
                      <button
                        key={file.name}
                        onClick={() => setActiveFileIndex(index)}
                        className={`rounded px-3 py-1 text-sm transition ${
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
                    <Editor
                      value={activeFile?.content}
                      language={getLanguage(activeFile)}
                      onChange={value => updateFileContent(activeFileIndex, value || '')}
                      height="100%"
                      theme="vs-dark"
                      options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-96">
                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Live preview</h3>
                    <iframe
                      key={previewKey + files.length}
                      title="preview"
                      className="mt-2 h-64 w-full rounded border border-slate-200 bg-white shadow-inner dark:border-slate-700"
                      sandbox="allow-scripts allow-same-origin"
                      srcDoc={combinedHtml}
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-700 dark:text-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Validation</h3>
                    {validation ? (
                      <div className="mt-2 space-y-2">
                        <p className={validation.passed ? 'text-emerald-500' : 'text-rose-500'}>
                          {validation.passed ? 'All rules passed' : 'Some checks failed'}
                        </p>
                        <ul className="space-y-1">
                          {validation.details.map((detail, index) => (
                            <li key={index} className="rounded bg-slate-100 p-2 dark:bg-slate-800">
                              <div className="font-medium">{detail.file as string}</div>
                              {'passed' in detail && (
                                <div className="text-xs text-slate-500">{(detail.passed as boolean) ? 'ok' : 'needs attention'}</div>
                              )}
                              {Array.isArray(detail.missing) && detail.missing.length > 0 && (
                                <div className="mt-1 text-xs text-rose-500">
                                  Missing: {(detail.missing as string[]).join(', ')}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-500">Run validation to check your project against the requirements.</p>
                    )}
                  </div>

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

export default Workspace;
