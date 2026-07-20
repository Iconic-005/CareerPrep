import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { createStore, resetStore } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, 'test-db.json');

test('new user registration initializes clean zero-state record', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const newUser = await store.registerUser({ name: 'Alex Smith', email: 'alex@example.com', password: 'password123' });
  assert.ok(newUser.id);
  assert.equal(newUser.name, 'Alex Smith');

  const dashboard = await store.getDashboard(newUser.id);
  assert.equal(dashboard.greeting, 'Alex');
  assert.equal(dashboard.readiness, 0);
  assert.equal(dashboard.stats[0].value, 'Not Generated');
  assert.equal(dashboard.stats[1].value, '--');
  assert.equal(dashboard.stats[2].value, '0 XP');
});

test('user data is strictly isolated per userId', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const userA = await store.registerUser({ name: 'Alice', email: 'alice@example.com' });
  const userB = await store.registerUser({ name: 'Bob', email: 'bob@example.com' });

  await store.addGoal(userA.id, 'Alice Goal 1');
  await store.addGoal(userB.id, 'Bob Goal 1');

  const goalsA = await store.getGoals(userA.id);
  const goalsB = await store.getGoals(userB.id);

  assert.equal(goalsA.length, 1);
  assert.equal(goalsA[0].title, 'Alice Goal 1');

  assert.equal(goalsB.length, 1);
  assert.equal(goalsB[0].title, 'Bob Goal 1');
});

test('completing actions updates user analytics dynamically', async () => {
  resetStore(testDbPath);
  const store = createStore(testDbPath);

  const user = await store.registerUser({ name: 'Mina', email: 'mina@example.com' });
  
  const goal = await store.addGoal(user.id, 'Complete 5 practice questions');
  await store.updateGoal(user.id, goal.id, { done: true });

  const dashboard = await store.getDashboard(user.id);
  assert.ok(dashboard.readiness > 0);
  assert.ok(dashboard.recentActivity.length > 0);
});
