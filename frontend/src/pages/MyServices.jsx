import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const token = savedUser?.token;

        if (!token) {
          console.error("No token found!");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/services/my-services', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setServices(data);
        }
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

        const response = await fetch(`http://localhost:5000/api/services/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setServices(services.filter(s => s._id !== id));
          alert("Deleted successfully! ✅");
        }
      } catch (err) {
        alert("Unable to delete. ❌");
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">My services (My Gigs)</h1>
      
      {loading ? (
        <p className="text-gray-600 font-medium">Loading your gigs...</p>
      ) : services.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">You haven't posted any gigs yet. 🧐</p>
          <Link to="/create-service" className="text-blue-600 font-bold hover:underline">Post your first gig now!</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-4 border-b text-blue-900">Title</th>
                <th className="p-4 border-b text-blue-900">Price</th>
                <th className="p-4 border-b text-blue-900">Category</th>
                <th className="p-4 border-b text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 border-b font-medium text-gray-800">{service.title}</td>
                  <td className="p-4 border-b text-green-600 font-bold">Rs. {service.price}</td>
                  <td className="p-4 border-b text-gray-600">{service.category}</td>
                  <td className="p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <Link 
                        to={`/edit-service/${service._id}`} 
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition font-bold"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(service._id)} 
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition font-bold"
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