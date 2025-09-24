import api from './apiClient';
import { SandboxFile } from './codingSandbox';

export interface StudentProjectSummary {
  project_id: string;
  title: string;
  description: string;
  is_published: boolean;
  updated_at: string;
  last_validated_at?: string | null;
  last_validation_result?: {
    passed?: boolean;
    details?: Array<Record<string, unknown>>;
  } | null;
}

export interface StudentProjectDetail extends StudentProjectSummary {
  files: SandboxFile[];
  validation_schema?: Record<string, unknown>;
}

const BASE = 'students/experience/projects/';

export const fetchProjects = async (): Promise<StudentProjectSummary[]> => {
  const response = await api.get<{ results: StudentProjectSummary[] }>(BASE);
  return response.data.results;
};

export const createProject = async (payload: {
  title: string;
  description?: string;
  files?: SandboxFile[];
  validation_schema?: Record<string, unknown>;
}): Promise<StudentProjectDetail> => {
  const response = await api.post<{ data: StudentProjectDetail }>(BASE, payload);
  return response.data.data;
};

export const fetchProject = async (projectId: string): Promise<StudentProjectDetail> => {
  const response = await api.get<{ data: StudentProjectDetail }>(`${BASE}${projectId}/`);
  return response.data.data;
};

export const updateProject = async (
  projectId: string,
  payload: Partial<Omit<StudentProjectDetail, 'project_id' | 'updated_at'>>,
): Promise<StudentProjectDetail> => {
  const response = await api.patch<{ data: StudentProjectDetail }>(`${BASE}${projectId}/`, payload);
  return response.data.data;
};

export const deleteProject = async (projectId: string) => api.delete(`${BASE}${projectId}/`);

export const publishProject = async (projectId: string, publish: boolean): Promise<StudentProjectSummary> => {
  const response = await api.post<{ data: StudentProjectSummary }>(`${BASE}${projectId}/publish/`, { publish });
  return response.data.data;
};

export const validateProject = async (
  projectId: string,
  payload?: { files?: SandboxFile[]; validation_schema?: Record<string, unknown> },
): Promise<{ passed: boolean; details: Array<Record<string, unknown>> }> => {
  const response = await api.post<{ data: { passed: boolean; details: Array<Record<string, unknown>> } }>(
    `${BASE}${projectId}/validate/`,
    payload || {},
  );
  return response.data.data;
};
