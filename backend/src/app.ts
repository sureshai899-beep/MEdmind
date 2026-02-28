import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import medicationRoutes from './routes/medication.routes.js';
import doseLogRoutes from './routes/doselog.routes.js';
import postRoutes from './routes/post.routes.js';
import drugRoutes from './routes/drug.routes.js';
import scanRoutes from './routes/scan.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/medications', medicationRoutes);
app.use('/api/v1/doses', doseLogRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/drugs', drugRoutes);
app.use('/api/v1/scan', scanRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;


