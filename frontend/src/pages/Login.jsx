import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          ...data.user,
          token: data.token
        };

        localStorage.setItem('user', JSON.stringify(userData));
        
        alert('Login successful! ✅');
        navigate('/'); 
        window.location.reload(); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-4">Sign In</button>
        </form>
        <p className="mt-6 text-center text-gray-600">Don't have an account yet? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;