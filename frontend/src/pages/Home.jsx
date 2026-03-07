import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Web Development', 'IT Support', 'Graphic Design', 'Tutoring'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/services');
        setServices(data);
        setFilteredServices(data); 
      } catch (err) {
        setError('Server connection error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let results = services;

    if (selectedCategory !== 'All') {
      results = results.filter(s => s.category === selectedCategory);
    }

    if (searchTerm) {
      results = results.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(results);
  }, [selectedCategory, searchTerm, services]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans">
      
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-3 tracking-tight">
          SkillMarket
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Showcase your skills, connect with people, and get the services you need in one place.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8 relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <span className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">🔍</span>
        </div>
        <input 
          type="text" 
          placeholder="Search for services (e.g. Website, Logo...)" 
          className="w-full py-3.5 pl-12 pr-6 rounded-full border border-gray-200 shadow-sm focus:shadow-md focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-gray-700 bg-white transition-all text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              selectedCategory === cat 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:text-blue-600 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      )}
      {error && <div className="text-center text-red-500 font-bold mb-10">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto max-w-7xl">
        {!loading && filteredServices.map((service) => (
          
          <div key={service._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full group overflow-hidden">
            
            <div className="p-5 flex flex-col flex-grow">
              
              <div className="flex justify-between items-center mb-4 shrink-0">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {service.category}
                </span>
                <span className="text-xl font-black text-emerald-500">
                  Rs.{service.price}
                </span>
              </div>
              
      
              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 h-[56px] leading-snug shrink-0">
                {service.title}
              </h2>

              <p className="text-gray-500 text-sm mb-4 line-clamp-5 h-[115px] leading-relaxed shrink-0">
                {service.shortDescription || service.description}
              </p>

              <div className="border-t border-gray-50 pt-4 mt-auto flex items-center shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base mr-3 shadow-sm">
                  {service.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">{service.seller?.name}</p>
                  <p className="text-[11px] text-blue-500 font-semibold truncate flex items-center gap-1">
                    🎓 {service.seller?.university || 'Trincomalee Campus'}
                  </p>
                </div>
              </div>

            </div>

        
            <div className="px-5 pb-5 shrink-0">
              <Link to={`/service/${service._id}`} className="block text-center w-full bg-gray-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white font-bold py-2.5 rounded-xl transition duration-300">
                View Details
              </Link>
            </div>

          </div>
        ))}
      </div>

      {!loading && filteredServices.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No services found matching your search.
        </div>
      )}
    </div>
  );
};

export default Home;