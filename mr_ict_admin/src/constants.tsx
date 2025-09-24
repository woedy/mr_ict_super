import { getAccessToken, getRefreshToken } from './services/tokenStorage';

export const baseUrl = (import.meta as any).env?.VITE_API_BASE
  ? (import.meta as any).env.VITE_API_BASE.replace(/\/?$/, '/')
  : 'http://localhost:8000/api/';
export const baseUrlMedia = (import.meta as any).env?.VITE_MEDIA_BASE || 'http://localhost:8000';
export const baseWsUrl = (import.meta as any).env?.VITE_WS_BASE || 'ws://localhost:8000/ws/';

export const userToken = getAccessToken();
export const refreshToken = getRefreshToken();
export const userID = localStorage.getItem('user_id');
export const userEmail = localStorage.getItem('email');
export const firstName = localStorage.getItem('first_name');
export const lastName = localStorage.getItem('last_name');
export const userPhoto = localStorage.getItem('photo');
export const projectID = localStorage.getItem('projectID');
export const project_name = localStorage.getItem('project_name');

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  php: '8.2.3',
};
