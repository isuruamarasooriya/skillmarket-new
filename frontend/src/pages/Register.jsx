import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return; 
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, university }), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration completed! You can now sign in.');
        navigate('/login'); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-72px)] bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Enter your full name" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Enter your email" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Create a strong password" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Confirm your password" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">University</label>
            <input 
              type="text" 
              value={university} 
              onChange={(e) => setUniversity(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="e.g., University of Vavuniya" 
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition duration-300 shadow-md mt-4">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;