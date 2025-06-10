import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function SendPaymentForm() {
  const location = useLocation();
  const locationToUser = location.state?.clientId || '';

  const [toUser] = useState(locationToUser);  // keep hidden, don't allow editing
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      `Are you sure you want to send ₹${amount} to user ${toUser} for "${reason}"?`
    );

    if (!confirmed) {
      return; // User canceled
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/receive-from-user', {
        toUser,
        amount: Number(amount),
        reason,
      });

      setMessage('Payment sent successfully!');

      // Clear form after success
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
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-green-600 mb-4 text-center">received Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden ToUser display */}
        <div className="text-sm text-gray-600 mb-2 text-center">
          Sending to User ID: <span className="font-mono">{toUser}</span>
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {loading ? 'Sending...' : 'Send Payment'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
