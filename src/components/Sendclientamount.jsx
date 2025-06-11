import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function SendPaymentForm() {
  const location = useLocation();
  const { clientId = '', clientName = '' } = location.state || {};
  const [toUser] = useState(clientId);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      `Are you sure you want to send ₹${amount} to ${clientName} (ID: ${toUser}) for "${reason}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:3000/api/send-to-user', {
        toUser,
        amount: Number(amount),
        reason,
      });

      setMessage('Payment sent successfully!');
      setAmount('');
      setReason('');
    } catch (error) {
      console.error('Error sending payment:', error);
      setMessage('Error sending payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-900 text-white shadow-lg rounded-xl border border-gray-700">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-4 text-center">
         Send Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8"
        >
          <div className="text-xs sm:text-sm text-gray-400 text-center">
            Sending to <span className="text-white font-bold">{clientName}</span> 
           
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base text-gray-300 font-medium">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base text-gray-300 font-medium">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              loading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {loading ? 'Sending...' : 'Send Payment'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium text-sm sm:text-base ${
              message.includes('success') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
