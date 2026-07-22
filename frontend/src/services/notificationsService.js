import { API_BASE_URL, getAuthHeaders } from './api.js';

export async function getNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() });
  return res.json();
}

export async function deleteNotification(id) {
  await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

export async function clearAllNotifications() {
  await fetch(`${API_BASE_URL}/notifications`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}
