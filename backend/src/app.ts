import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import trainingRoutes from './routes/training.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import statsRoutes from './routes/stats.routes';
import { swaggerSpec, swaggerUiHandler } from './swagger';


const app = express();

app.use(cors({
    origin: "http://localhost:3001", 
    credentials: true, 
} ));

app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api', statsRoutes);
app.use('/api-docs', swaggerUiHandler.serve, swaggerUiHandler.setup(swaggerSpec));

export default app;
