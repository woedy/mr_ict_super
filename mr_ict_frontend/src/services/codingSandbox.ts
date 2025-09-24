import api from './apiClient';

export interface SandboxFile {
  name: string;
  content: string;
  language?: string;
}

export interface ChallengeSummary {
  slug: string;
  title: string;
  difficulty: string;
  entrypoint_filename: string;
  time_limit_seconds: number;
  is_completed: boolean;
  last_run?: {
    stdout?: string;
    stderr?: string;
    exit_code?: number;
    timed_out?: boolean;
    last_run_at?: string;
  } | null;
}

export interface ChallengeDetail {
  slug: string;
  title: string;
  instructions: string;
  difficulty: string;
  expected_output?: string | null;
  entrypoint_filename: string;
  starter_files: SandboxFile[];
  solution_files?: SandboxFile[];
  solution_available: boolean;
  current_files: SandboxFile[];
  hints: {
    revealed: string[];
    remaining: number;
  };
  time_limit_seconds: number;
  state?: {
    hints_revealed: number;
    last_run_result?: unknown;
    last_run_at?: string | null;
    is_completed: boolean;
    completed_at?: string | null;
  } | null;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  timed_out: boolean;
  duration?: number;
  files: SandboxFile[];
}

export interface SubmitResult {
  passed: boolean;
  cases: Array<Record<string, unknown>>;
  files: SandboxFile[];
  solution_files?: SandboxFile[];
}

const BASE = 'students/experience/coding/challenges/';

export const fetchChallenges = async (): Promise<ChallengeSummary[]> => {
  const response = await api.get<{ results: ChallengeSummary[] }>(BASE);
  return response.data.results;
};

export const fetchChallenge = async (slug: string): Promise<ChallengeDetail> => {
  const response = await api.get<{ data: ChallengeDetail }>(`${BASE}${slug}/`);
  return response.data.data;
};

export const autosaveChallenge = async (slug: string, files: SandboxFile[]) => {
  return api.post(`${BASE}${slug}/autosave/`, { files });
};

export const resetChallenge = async (slug: string) => {
  const response = await api.post<{ data: { files: SandboxFile[] } }>(`${BASE}${slug}/reset/`, {});
  return response.data.data;
};

export const runChallenge = async (
  slug: string,
  payload: { files?: SandboxFile[]; stdin?: string },
): Promise<RunResult> => {
  const response = await api.post<{ data: RunResult }>(`${BASE}${slug}/run/`, payload);
  return response.data.data;
};

export const submitChallenge = async (
  slug: string,
  payload: { files?: SandboxFile[] },
): Promise<SubmitResult> => {
  const response = await api.post<{ data: SubmitResult }>(`${BASE}${slug}/submit/`, payload);
  return response.data.data;
};

export const requestHint = async (
  slug: string,
): Promise<{ hint: string; revealed: string[]; remaining: number }> => {
  const response = await api.post<{ data: { hint: string; revealed: string[]; remaining: number } }>(
    `${BASE}${slug}/hint/`,
    {},
  );
  return response.data.data;
};
