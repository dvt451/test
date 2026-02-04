import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'Access denied. No token provided.'
		});
	}

	const decoded = verifyToken(token);

	if (!decoded) {
		return res.status(401).json({
			success: false,
			message: 'Invalid token.'
		});
	}

	req.userId = decoded.userId;
	next();
};