import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

  const handleContactClick = () => {
    navigate(`/contact-seller/${id}`, { state: { service } });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!service) return (
    <div className="text-center mt-20">
      <p className="font-bold text-red-500 text-xl">Service not found! ❌</p>
      <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Go Back Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
              {service.category}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
              {service.title}
            </h1>
            
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg italic bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                {service.fullDescription || service.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-50 sticky top-24">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-gray-400 font-bold text-xs uppercase mb-1 tracking-widest">Fixed Price</p>
              <h2 className="text-5xl font-black text-green-600">Rs. {service.price}</h2>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleContactClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition duration-300 shadow-xl shadow-blue-100 transform hover:scale-[1.02]"
              >
                <span className="text-xl">📧</span> Contact Seller via Email
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;