import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Проверка существования пользователя
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists'
			});
		}

		// Создание нового пользователя
		const user = new User({ email, password });
		await user.save();

		// Генерация токена
		const token = generateToken(user._id);

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			token,
			user: {
				id: user._id,
				email: user.email
			}
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error during registration'
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Поиск пользователя
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		// Проверка пароля
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		// Генерация токена
		const token = generateToken(user._id);

		res.json({
			success: true,
			message: 'Logged in successfully',
			token,
			user: {
				id: user._id,
				email: user.email
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error during login'
		});
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password');

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		res.json({
			success: true,
			user
		});
	} catch (error) {
		console.error('Get profile error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error'
		});
	}
};