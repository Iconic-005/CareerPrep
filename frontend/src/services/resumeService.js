import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getResume() {
  const res = await fetch(`${API_BASE_URL}/resume`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load resume');
  return res.json();
}

export async function buildResumeWithAI() {
  const res = await fetch(`${API_BASE_URL}/resume/build`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to build resume with AI');
  }
  return res.json();
}

export async function updateResume(payload) {
  const res = await fetch(`${API_BASE_URL}/resume`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return res.json();
}

export async function restoreResumeVersion(versionId) {
  const res = await fetch(`${API_BASE_URL}/resume/restore-version`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ versionId }),
  });
  if (!res.ok) throw new Error('Failed to restore resume version');
  return res.json();
}

export async function optimizeResume(resumeText, targetRole) {
  const response = await fetch(`${API_BASE_URL}/resume/optimize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ resumeText, targetRole }),
  });
  return response.json();
}
