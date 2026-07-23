import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './apiRoutes.js';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

test.before(async () => {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

test.after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

test('GET /api/health returns health status', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(data.config.mongodbConfigured, true);
  } finally {
    server.close();
  }
});

test('Full Auth, Dashboard, Goals CRUD & Activity API workflow', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const testEmail = `test_user_${Date.now()}@example.com`;
    const regRes = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Runner', email: testEmail, password: 'password123' }),
    });
    const regData = await regRes.json();
    assert.ok(regData.token);
    assert.equal(regData.success, true);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${regData.token}`,
    };

    // 1. Initial Dashboard should be empty for new user
    const initialDashRes = await fetch(`http://localhost:${port}/api/dashboard`, { headers });
    const initialDashData = await initialDashRes.json();
    assert.equal(initialDashRes.status, 200);
    assert.equal(initialDashData.codingXP, 0);
    assert.equal(initialDashData.careerReadiness, 0);

    // 2. Create Goal
    const createRes = await fetch(`http://localhost:${port}/api/goals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title: 'Build 3 Fullstack MongoDB Projects' }),
    });
    const createdGoal = await createRes.json();
    assert.equal(createRes.status, 201);
    assert.equal(createdGoal.title, 'Build 3 Fullstack MongoDB Projects');

    const goalId = createdGoal.id || createdGoal._id;

    // 3. Toggle Goal
    const updateRes = await fetch(`http://localhost:${port}/api/goals/${goalId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ done: true }),
    });
    const updatedGoal = await updateRes.json();
    assert.equal(updateRes.status, 200);
    assert.equal(updatedGoal.done, true);

    // 4. Get Dashboard after goal completion
    const dashRes = await fetch(`http://localhost:${port}/api/dashboard`, { headers });
    const dashData = await dashRes.json();
    assert.equal(dashRes.status, 200);
    assert.equal(dashData.greeting, 'Test');
    assert.ok(dashData.codingXP >= 25);

    // 5. Test Activity Log API
    const activityRes = await fetch(`http://localhost:${port}/api/activity?category=All`, { headers });
    const activityData = await activityRes.json();
    assert.equal(activityRes.status, 200);
    assert.ok(Array.isArray(activityData.activities));

    // 6. Delete Goal
    const deleteRes = await fetch(`http://localhost:${port}/api/goals/${goalId}`, {
      method: 'DELETE',
      headers,
    });
    const deleteResult = await deleteRes.json();
    assert.equal(deleteRes.status, 200);
    assert.equal(deleteResult.success, true);
  } finally {
    server.close();
  }
});

test('AI Resume Builder API Workflow', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const testEmail = `resume_test_${Date.now()}@example.com`;
    const regRes = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Resume Tester', email: testEmail, password: 'password123' }),
    });
    const regData = await regRes.json();
    assert.ok(regData.token);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${regData.token}`,
    };

    // 1. Fetch initial resume (should auto-build from profile)
    const initialRes = await fetch(`http://localhost:${port}/api/resume`, { headers });
    const initialData = await initialRes.json();
    assert.equal(initialRes.status, 200);
    assert.ok(initialData.contact);
    assert.equal(initialData.contact.name, 'Resume Tester');

    // 2. Trigger Build Resume with AI
    const buildRes = await fetch(`http://localhost:${port}/api/resume/build`, {
      method: 'POST',
      headers,
    });
    const buildData = await buildRes.json();
    assert.equal(buildRes.status, 200);
    assert.ok(buildData.summary);
    assert.ok(Array.isArray(buildData.versions));
    assert.ok(buildData.versions.length >= 1);

    // 3. Edit Resume section
    const updateRes = await fetch(`http://localhost:${port}/api/resume`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        summary: 'Updated summary for testing live MongoDB persistence.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AI Integration'],
      }),
    });
    const updateData = await updateRes.json();
    assert.equal(updateRes.status, 200);
    assert.equal(updateData.summary, 'Updated summary for testing live MongoDB persistence.');
    assert.ok(updateData.skills.includes('AI Integration'));

    // 4. Restore Previous Version
    const versionId = buildData.versions[0].id;
    const restoreRes = await fetch(`http://localhost:${port}/api/resume/restore-version`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ versionId }),
    });
    const restoreData = await restoreRes.json();
    assert.equal(restoreRes.status, 200);
    assert.ok(restoreData.contact);
  } finally {
    server.close();
  }
});

