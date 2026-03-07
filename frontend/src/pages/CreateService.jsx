import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Web Development');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = savedUser?.token;

    if (!token) {
      alert("Please login to post a gig! ⚠️");
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const newGig = { 
        title, 
        shortDescription, 
        fullDescription, 
        price, 
        category 
      };

      await axios.post('http://localhost:5000/api/services', newGig, config);
      alert('Gig posted successfully! ✅');
      navigate('/my-services');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post gig ❌');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Post a New Gig</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-1 text-sm">Gig Title</label>
            <input type="text" value={title} maxLength="60" onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
            <p className="text-right text-xs text-gray-500 mt-1">
              {title.length} / 60 characters
            </p>
          </div>
          
          <div>
            <div className="flex justify-between">
              <label className="block text-gray-700 font-bold mb-1 text-sm">Short Summary (Home page display)</label>
              <span className={`text-xs ${shortDescription.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                {shortDescription.length}/250
              </span>
            </div>
            <textarea 
              maxLength="250"
              value={shortDescription} 
              onChange={(e) => setShortDescription(e.target.value)} 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 h-24 outline-none text-sm" 
              placeholder="Briefly explain what you offer..."
              required 
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="block text-gray-700 font-bold mb-1 text-sm">Detailed Description (Full details page)</label>
              <span className={`text-xs ${fullDescription.length > 4800 ? 'text-red-500' : 'text-gray-400'}`}>
                {fullDescription.length}/5000
              </span>
            </div>
            <textarea 
              maxLength="5000"
              value={fullDescription} 
              onChange={(e) => setFullDescription(e.target.value)} 
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 h-48 outline-none text-sm" 
              placeholder="Provide full details, requirements, and features..."
              required 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-1 text-sm">Price (Rs.)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-1 text-sm">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white">
                <option value="Web Development">Web Development</option>
                <option value="IT Support">IT Support</option>
                <option value="Graphic Design">Graphic Design</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition duration-300">
            Publish Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateService;