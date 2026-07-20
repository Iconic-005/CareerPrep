import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { createStore, resetStore } from './store.js';
import {
  addGoalData,
  analyzeJobDescriptionData,
  getDashboardData,
  handleChatRequest,
  updateGoalData,
  updateProfileData,
} from '../controllers/controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, 'test-db.json');

test('persists profile and settings updates', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const profile = await store.updateProfile({ name: 'Jamie', title: 'Product Manager' });
  assert.equal(profile.name, 'Jamie');

  const settings = await store.updateSettings({ preferences: { email: false, reminders: true } });
  assert.equal(settings.preferences.email, false);

  const saved = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
  assert.equal(saved.profile.name, 'Jamie');
  assert.equal(saved.settings.preferences.email, false);
});

test('registers and logs in users', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const user = await store.registerUser({ name: 'Sam', email: 'sam@example.com', password: 'secret' });
  assert.equal(user.email, 'sam@example.com');

  const login = await store.loginUser({ email: 'sam@example.com', password: 'secret' });
  assert.equal(login.user.email, 'sam@example.com');
});

test('dashboard data uses the saved profile and updates goals dynamically', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);
  await store.updateProfile({ name: 'Mina Chen', title: 'ML Engineer' });

  const goal = await store.addGoal('Complete 5 LeetCode hard problems');
  assert.equal(goal.title, 'Complete 5 LeetCode hard problems');

  const updated = await store.updateGoal(goal.id, { done: true });
  assert.equal(updated.done, true);
  assert.equal(updated.status, 'Complete');

  const dashboard = await getDashboardData();
  assert.ok(dashboard.readiness >= 50);
});

test('JD analyzer computes match score and recommends improvements', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const jdText = 'Looking for a Senior Product Manager with expertise in Figma, Product Strategy, and SQL.';
  const analysis = await store.analyzeJD(jdText);

  assert.ok(analysis.keywordMatch);
  assert.ok(analysis.atsScore);
  assert.ok(analysis.matchedSkills.includes('Figma') || analysis.matchedSkills.includes('Product Strategy'));
  assert.ok(analysis.recommendations.length > 0);
});

test('dynamic AI coach responds to user prompts accurately', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const res1 = await store.handleChat('How can I optimize my resume bullet points?');
  assert.ok(res1.reply.includes('Google X-Y-Z formula'));

  const res2 = await store.handleChat('What is the best way to prep for an interview?');
  assert.ok(res2.reply.includes('STAR method'));
});

test('admin user management adds and removes users', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const newAdmin = await store.addAdminUser({ name: 'Taylor Swift', email: 'taylor@music.com', subscription: 'Pro' });
  assert.equal(newAdmin.name, 'Taylor Swift');

  const stateBefore = await store.getState();
  assert.ok(stateBefore.adminUsers.some((u) => u.id === newAdmin.id));

  await store.deleteAdminUser(newAdmin.id);
  const stateAfter = await store.getState();
  assert.ok(!stateAfter.adminUsers.some((u) => u.id === newAdmin.id));
});
