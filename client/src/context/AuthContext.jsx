import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			setLoading(false);
			return;
		}

		try {
			const response = await authAPI.getProfile();
			setUser(response.data.user);
		} catch (error) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		} finally {
			setLoading(false);
		}
	};

	const register = async (email, password) => {
		setError('');
		try {
			const response = await authAPI.register(email, password);
			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			return { success: true };
		} catch (error) {
			const message = error.response?.data?.message || 'Registration failed';
			setError(message);
			return { success: false, message };
		}
	};

	const login = async (email, password) => {
		setError('');
		try {
			const response = await authAPI.login(email, password);
			const { token, user } = response.data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);

			return { success: true };
		} catch (error) {
			const message = error.response?.data?.message || 'Login failed';
			setError(message);
			return { success: false, message };
		}
	};

	const logout = () => {
		authAPI.logout();
		setUser(null);
	};

	const value = {
		user,
		loading,
		error,
		register,
		login,
		logout,
		isAuthenticated: !!user
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};