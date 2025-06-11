import { useState } from 'react';

export default function AddClient() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '+92',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'phoneNumber') {
    // Prevent removing "+92" and allow only digits after it
    if (!value.startsWith('+92')) return;
    const digits = value.slice(3).replace(/\D/g, ''); // remove non-digits after +92
    if (digits.length > 10) return; // limit to 10 digits
    setFormData((prev) => ({ ...prev, phoneNumber: '+92' + digits }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

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
   <div   className="mt-8 mx-2 ">

 <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 shadow-2xl rounded-2xl p-4 sm:p-8 md:p-10 lg:p-12 max-w-2xl w-full mx-auto space-y-2 border border-zinc-700"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-400 text-center">
        Add New Client
      </h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Client Name"
        className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
<input
  type="tel"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
  placeholder="+92XXXXXXXXXX"
  className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
  required
/>

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl rounded-xl hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Client'}
      </button>

      {message && (
        <p
          className={`text-center text-base font-semibold ${
            message.toLowerCase().includes('successfully')
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </form>

   </div>
  );
}
