import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getPractice() {
  const res = await fetch(`${API_BASE_URL}/practice`, { headers: getAuthHeaders() });
  return res.json();
}

export async function submitPractice(payload) {
  const res = await fetch(`${API_BASE_URL}/practice/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}
