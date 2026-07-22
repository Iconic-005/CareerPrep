import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { createStore } from './store.js';

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

test('new user registration initializes clean record in MongoDB', async () => {
  const store = createStore();
  const testEmail = `alex_${Date.now()}@example.com`;

  const newUser = await store.registerUser({ name: 'Alex Smith', email: testEmail, password: 'password123' });
  assert.ok(newUser.id);
  assert.equal(newUser.name, 'Alex Smith');

  const dashboard = await store.getDashboard(newUser.id);
  assert.equal(dashboard.greeting, 'Alex');
  assert.ok(dashboard.user.id);
  assert.ok(dashboard.stats.length === 3);
});

test('user data is strictly isolated per userId', async () => {
  const store = createStore();
  const emailA = `alice_${Date.now()}@example.com`;
  const emailB = `bob_${Date.now()}@example.com`;

  const userA = await store.registerUser({ name: 'Alice', email: emailA, password: 'password123' });
  const userB = await store.registerUser({ name: 'Bob', email: emailB, password: 'password123' });

  await store.addGoal(userA.id, 'Alice Goal 1');
  await store.addGoal(userB.id, 'Bob Goal 1');

  const goalsA = await store.getGoals(userA.id);
  const goalsB = await store.getGoals(userB.id);

  assert.ok(goalsA.some((g) => g.title === 'Alice Goal 1'));
  assert.ok(goalsB.some((g) => g.title === 'Bob Goal 1'));
  assert.ok(!goalsA.some((g) => g.title === 'Bob Goal 1'));
});

test('completing actions updates user analytics dynamically', async () => {
  const store = createStore();
  const emailMina = `mina_${Date.now()}@example.com`;

  const user = await store.registerUser({ name: 'Mina', email: emailMina, password: 'password123' });
  
  const goal = await store.addGoal(user.id, 'Complete 5 practice questions');
  await store.updateGoal(user.id, goal.id || goal._id, { done: true });

  const dashboard = await store.getDashboard(user.id);
  assert.ok(dashboard.codingXP >= 25);
  assert.ok(dashboard.recentActivity.length > 0);
});
