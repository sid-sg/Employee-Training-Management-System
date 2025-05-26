import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import trainingRoutes from './routes/training.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import { swaggerSpec, swaggerUiHandler } from './swagger';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api-docs', swaggerUiHandler.serve, swaggerUiHandler.setup(swaggerSpec));

export default app;
