import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

const distPath = path.resolve(__dirname, '../dist');
const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
  ? path.join(distPath, 'index.html')
  : path.resolve(__dirname, '../index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(indexPath);
});

async function startServer() {
  // ── Gemini API Key Validation ─────────────────────────────────────────────
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('❌ GEMINI_API_KEY is not set in .env — AI features will not work.');
    console.error('   Get a key from: https://aistudio.google.com/app/apikey');
  } else if (!geminiKey.startsWith('AIza')) {
    console.error('❌ GEMINI_API_KEY appears invalid (should start with "AIza").');
    console.error('   Current key prefix:', geminiKey.slice(0, 8));
    console.error('   Get a valid key from: https://aistudio.google.com/app/apikey');
  } else {
    console.log('✅ Gemini API Loaded: true');
  }
  // ──────────────────────────────────────────────────────────────────────────

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.warn('⚠️  MongoDB connection failed:', error.message);
    }
  } else {
    console.warn('⚠️  MONGODB_URI is not set. Skipping MongoDB connection.');
  }

  const server = app.listen(port, () => {
    console.log(`🚀 CareerPrep API running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Close the existing process or set a different PORT in your .env file.`);
      process.exit(1);
    }
    throw error;
  });
}

startServer();
