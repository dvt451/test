import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
	const { user, logout, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, navigate]);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold">Dashboard</h1>
						</div>
						<div className="flex items-center">
							<span className="mr-4 text-gray-700">{user.email}</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="bg-white overflow-hidden shadow rounded-lg">
					<div className="px-4 py-5 sm:p-6">
						<h2 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h2>
						<p className="text-gray-600">
							You are successfully logged in. This is your protected dashboard.
						</p>
						<div className="mt-6 p-4 bg-blue-50 rounded-md">
							<h3 className="font-semibold text-blue-800">Your Information:</h3>
							<ul className="mt-2 text-blue-700">
								<li>Email: {user.email}</li>
								<li>User ID: {user.id}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;