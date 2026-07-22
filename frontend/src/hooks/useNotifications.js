import { useState, useEffect } from 'react';
import {
  getNotifications,
  deleteNotification,
  clearAllNotifications,
} from '../services/notificationsService.js';

export function useNotifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getNotifications()
      .then((data) => setItems(data.groups || []))
      .catch(() => setItems([]));
  }, []);

  const handleDeleteNotif = async (id) => {
    try {
      await deleteNotification(id);
      setItems((curr) => curr.filter((i) => i.id !== id));
    } catch {
      // silent
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setItems([]);
    } catch {
      // silent
    }
  };

  return { items, handleDeleteNotif, handleClearAll };
}
