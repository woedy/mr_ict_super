import api from '../../services/apiClient';

export const fetchProjects = () => api.get('projects/');
export const fetchProject = (id: number | string) => api.get(`projects/${id}/`);
export const fetchProjectFiles = (projectId: number | string) =>
  api.get(`project_files/by_project/?project=${projectId}`);
export const updateFile = (fileId: number | string, content: unknown) =>
  api.patch(`project_files/${fileId}/`, { content });
export const createProject = (projectData: unknown) => api.post('projects/create/', projectData);

