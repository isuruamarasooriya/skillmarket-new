import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const savedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const getLatestUserData = async () => {
      if (savedUser && savedUser.token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${savedUser.token}` }
          };
          const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
          setUserName(data.name);
          localStorage.setItem('user', JSON.stringify({ ...savedUser, name: data.name }));
        } catch (err) {
          console.error("Navbar data fetch error", err);
          setUserName(savedUser.name);
        }
      }
    };

    getLatestUserData();
  }, []);

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="bg-white text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
            S
          </div>
          SkillMarket
        </Link>

        <div className="space-x-6 flex items-center">
          {savedUser ? (
            <>
              <Link 
                to="/my-services" 
                className="hover:text-blue-200 font-semibold transition hidden md:block"
              >
                My Gigs
              </Link>

              <Link 
                to="/create-service" 
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-bold transition shadow-md"
              >
                + Post a Gig
              </Link>

              <Link 
                to="/profile" 
                className="flex items-center gap-2 bg-blue-700/50 hover:bg-blue-800 transition px-4 py-2 rounded-2xl border border-blue-400"
              >
                <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {(userName || savedUser.name)?.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold hidden sm:block">
                  Hi, {(userName || savedUser.name)?.split(' ')[0]}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition font-bold">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;