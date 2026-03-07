import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
        setTitle(data.title);
        setShortDescription(data.shortDescription || '');
        setFullDescription(data.fullDescription || '');
        setPrice(data.price);
        setCategory(data.category);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = savedUser?.token;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const updateData = { title, shortDescription, fullDescription, price, category };
      await axios.put(`http://localhost:5000/api/services/${id}`, updateData, config);

      alert('Gig updated successfully! ✅');
      navigate('/my-services');
    } catch (err) {
      alert('Update failed ❌');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Update Your Gig</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between">
              <label className="block font-bold mb-1">Title</label>
              <span className={`text-xs ${title.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {title.length}/60
              </span>
            </div>
            <input 
              type="text" 
              maxLength="60"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <label className="block font-bold mb-1">Short Description (Home Page)</label>
              <span className={`text-xs ${shortDescription.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                {shortDescription.length}/250
              </span>
            </div>
            <textarea 
              maxLength="250"
              value={shortDescription} 
              onChange={(e) => setShortDescription(e.target.value)} 
              className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Full Description</label>
            <textarea 
              value={fullDescription} 
              onChange={(e) => setFullDescription(e.target.value)} 
              className="w-full p-3 border rounded-lg h-48 focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-bold mb-1">Price (Rs.)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            
            <div className="w-1/2">
              <label className="block font-bold mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg bg-white outline-none">
                <option value="Web Development">Web Development</option>
                <option value="IT Support">IT Support</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Tutoring">Tutoring</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition mt-4">
            Update Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditService;