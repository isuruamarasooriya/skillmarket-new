import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const ContactSeller = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/services`)
      .then(res => res.json())
      .then(data => setService(data.find(s => s._id === id)));
  }, [id]);

 
  const handleSendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    const templateParams = {
      from_name: formData.name,      
      from_email: formData.email, 
      message: formData.message, 
      service_title: service?.title,
      to_email: service?.seller?.email
    };

    emailjs.send(
      'service_iiylz0f', 
      'template_w1wk4cf',
      templateParams,
      '17IGjbLb0dw4pMvn3'
    )
    .then(() => {
      alert("Message sent successfully to the seller!✅");
      setFormData({ name: '', email: '', message: '' });
    })
    .catch(() => alert("Failed to send.❌"))
    .finally(() => setSending(false));
  };

  if (!service) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      <p className="text-gray-600 mb-8">{service.description}</p>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold mb-4 text-blue-700">Contact {service.seller?.name}</h3>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <input 
            type="text" placeholder="Your Name" required
            className="w-full p-3 border rounded-lg"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Your email address" required
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <textarea 
            placeholder="Write your message here…" required
            className="w-full p-3 border rounded-lg h-32"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <button 
            type="submit" disabled={sending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {sending ? 'Sending…' : 'Send Message to Seller'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSeller;