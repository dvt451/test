import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { validateRegister, validateLogin } from './middleware/validation.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('✅ MongoDB connected successfully');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		process.exit(1);
	}
};

// Start server
const startServer = async () => {
	await connectDB();

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
		console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
	});
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: 'Internal server error'
	});
});