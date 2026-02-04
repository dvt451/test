// client/src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Создаём экземпляр axios
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export const authAPI = {
	register: (email, password) =>
		api.post('/auth/register', { email, password }),

	login: (email, password) =>
		api.post('/auth/login', { email, password }),

	getProfile: () =>
		api.get('/auth/profile'),

	logout: () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}
};

export default api;