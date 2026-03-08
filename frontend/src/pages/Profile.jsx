import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser || !savedUser.token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${savedUser.token}` } };
        const { data } = await API.get('/auth/profile', config);
        
        setName(data.name || '');
        setEmail(data.email || '');
        setUniversity(data.university || '');
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${savedUser.token}` } };
      
      const { data } = await API.put('/auth/profile', 
        { name, university, password }, config);
      
      alert("Profile updated successfully! ✅");
      localStorage.setItem('user', JSON.stringify({ ...savedUser, name: data.user.name }));
      setIsEditMode(false);
      setPassword(''); 
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure? This will permanently delete your account and all your listed gigs! ⚠️")) {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${savedUser.token}` } };
        
        await API.delete('/auth/profile', config);
        localStorage.removeItem('user');
        alert("Account and all your gigs deleted successfully! ✅");
        window.location.href = '/register'; 
        
      } catch (err) {
        alert("Delete failed ❌");
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 mb-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-tight">User Profile</h2>

      {!isEditMode ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center pb-6 border-b border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-full flex items-center justify-center text-5xl font-bold mb-4 shadow-lg ring-4 ring-blue-50">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
            <p className="text-gray-500 font-medium">{email}</p>
            <div className="mt-3 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold border border-blue-100">
              📍 {university || 'Not specified'}
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setIsEditMode(true)}
              className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
            >
              ⚙️ Edit Profile
            </button>
            
            <button 
              onClick={handleLogout} 
              className="w-full bg-white text-red-600 py-3.5 rounded-2xl font-bold border-2 border-red-50 hover:bg-red-50 transition duration-300 flex items-center justify-center gap-2"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={updateHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">University / Location</label>
            <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Change Password (optional)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="New password" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl font-bold hover:bg-green-700 transition shadow-md">Save</button>
            <button type="button" onClick={() => setIsEditMode(false)} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition">Cancel</button>
          </div>

          <button type="button" onClick={deleteHandler} className="w-full text-red-400 text-sm font-semibold hover:text-red-600 hover:underline transition mt-4 text-center">
            Delete my account permanently
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;