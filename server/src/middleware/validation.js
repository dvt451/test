export const validateRegister = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: 'Email and password are required'
		});
	}

	// Простая валидация email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid email format'
		});
	}

	// Валидация пароля
	if (password.length < 6) {
		return res.status(400).json({
			success: false,
			message: 'Password must be at least 6 characters'
		});
	}

	next();
};

export const validateLogin = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: 'Email and password are required'
		});
	}

	next();
};