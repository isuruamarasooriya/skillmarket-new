import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const token = savedUser?.token;

        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await API.get('/services/my-services', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setServices(data);
      } catch (err) {
        console.error("Error fetching my services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const token = savedUser?.token;

        await API.delete(`/services/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setServices(services.filter(s => s._id !== id));
        alert("Deleted successfully! ✅");
      } catch (err) {
        alert("Unable to delete. ❌");
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">My services (My Gigs)</h1>
      
      {loading ? (
        <p className="text-gray-600 font-medium italic">Loading your gigs...</p>
      ) : services.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-2">You haven't posted any gigs yet. 🧐</p>
          <Link to="/create-service" className="text-blue-600 font-bold hover:underline">Post your first gig now!</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 text-blue-900 font-bold">Title</th>
                <th className="p-4 text-blue-900 font-bold">Price</th>
                <th className="p-4 text-blue-900 font-bold">Category</th>
                <th className="p-4 text-blue-900 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200 border-b last:border-none">
                  <td className="p-4 font-medium text-gray-800">{service.title}</td>
                  <td className="p-4 text-emerald-600 font-black">Rs. {service.price}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wide">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Link 
                        to={`/edit-service/${service._id}`} 
                        className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 font-bold text-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(service._id)} 
                        className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition duration-300 font-bold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyServices;