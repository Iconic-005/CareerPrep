import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getResume() {
  const res = await fetch(`${API_BASE_URL}/resume`, { headers: getAuthHeaders() });
  return res.json();
}

export async function updateResume(payload) {
  await fetch(`${API_BASE_URL}/resume`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function optimizeResume(resumeText, targetRole) {
  const response = await fetch(`${API_BASE_URL}/resume/optimize`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ resumeText, targetRole }),
  });
  return response.json();
}
