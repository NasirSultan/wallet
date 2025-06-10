import { useState } from 'react';

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic validation
    if (!formData.name || !formData.phoneNumber || !formData.address) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to add client';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        setMessage(errorMsg);
        setLoading(false);
        return;
      }

      setMessage('Client added successfully!');
      setFormData({ name: '', phoneNumber: '', address: '' });
    } catch (error) {
      setMessage('Network or server error occurred');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold text-blue-600 text-center">Add New Client</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Client Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Client'}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.toLowerCase().includes('successfully')
              ? 'text-green-600 font-semibold'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
