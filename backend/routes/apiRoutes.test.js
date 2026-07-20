import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import apiRoutes from './apiRoutes.js';
import { resetStore } from '../data/store.js';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

test('GET /api/health returns health status', async () => {
  resetStore();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
  } finally {
    server.close();
  }
});

test('Goals CRUD endpoints work dynamically', async () => {
  resetStore();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    // 1. Create Goal
    const createRes = await fetch(`http://localhost:${port}/api/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Build 3 Fullstack Projects' }),
    });
    const createdGoal = await createRes.json();
    assert.equal(createRes.status, 201);
    assert.equal(createdGoal.title, 'Build 3 Fullstack Projects');

    // 2. Toggle Goal
    const updateRes = await fetch(`http://localhost:${port}/api/goals/${createdGoal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: true }),
    });
    const updatedGoal = await updateRes.json();
    assert.equal(updateRes.status, 200);
    assert.equal(updatedGoal.done, true);

    // 3. Delete Goal
    const deleteRes = await fetch(`http://localhost:${port}/api/goals/${createdGoal.id}`, {
      method: 'DELETE',
    });
    const deleteResult = await deleteRes.json();
    assert.equal(deleteRes.status, 200);
    assert.equal(deleteResult.success, true);
  } finally {
    server.close();
  }
});

test('POST /api/jd-analyzer returns live matching analysis', async () => {
  resetStore();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/jd-analyzer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription: 'Seeking Senior Product Manager with Figma, SQL, and Product Strategy experience.' }),
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.keywordMatch);
    assert.ok(data.atsScore);
  } finally {
    server.close();
  }
});

test('POST /api/chat returns dynamic AI responses', async () => {
  resetStore();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I prep for coding interviews?' }),
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.reply);
  } finally {
    server.close();
  }
});

test('GET /api/auth/me returns registered user details using token', async () => {
  resetStore();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const registerRes = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sanju Dutta', email: 'sanju@gmail.com', password: 'password123' }),
    });
    const registerData = await registerRes.json();
    assert.ok(registerData.token);

    const meRes = await fetch(`http://localhost:${port}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${registerData.token}`,
      },
    });
    const meData = await meRes.json();
    assert.equal(meRes.status, 200);
    assert.equal(meData.name, 'Sanju Dutta');
    assert.equal(meData.email, 'sanju@gmail.com');
  } finally {
    server.close();
  }
});
