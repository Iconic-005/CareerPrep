import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getProfile() {
  const res = await fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() });
  return res.json();
}

export async function updateProfile(payload) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to save profile');
  return data;
}
