import express from 'express';
import {
  getAdminData,
  getCoachData,
  getDashboardData,
  getNotificationsData,
  getProfileData,
  getResumeData,
  getSettingsData,
  submitAuthRequest,
  submitContactForm,
  updateProfileData,
  updateSettingsData,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, message: 'CareerPrep API is healthy' });
});

router.get('/dashboard', async (req, res) => {
  res.json(await getDashboardData());
});

router.get('/resume', async (req, res) => {
  res.json(await getResumeData());
});

router.get('/coach', async (req, res) => {
  res.json(await getCoachData());
});

router.get('/notifications', async (req, res) => {
  res.json(await getNotificationsData());
});

router.get('/profile', async (req, res) => {
  res.json(await getProfileData());
});

router.get('/settings', async (req, res) => {
  res.json(await getSettingsData());
});

router.put('/profile', async (req, res) => {
  try {
    const result = await updateProfileData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const result = await updateSettingsData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/admin', async (req, res) => {
  res.json(await getAdminData());
});

router.post('/auth/login', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'login');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'register');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const result = await submitContactForm(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
