import { useState, useEffect } from 'react';

export default function AddAmount() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestAdded, setLatestAdded] = useState(null);

  // Load latest added amount from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('latestAdded');
    if (saved) {
      setLatestAdded(Number(saved));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setMessage('Please enter a valid amount greater than 0');
      return;
    }

    const confirmSubmit = window.confirm(`Are you sure you want to add ₹${numericAmount}?`);
    if (!confirmSubmit) return;

    setLoading(true);

    try {
      const res = await fetch('https://wallet-lyart.vercel.app/api/balance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add amount');
      }

      await res.json();

      setLatestAdded(numericAmount);
      localStorage.setItem('latestAdded', numericAmount); // Save in localStorage
      setMessage('Successfully added!');
      setAmount('');
    } catch (err) {
      setMessage(err.message || 'Server or network error');
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-2xl w-full mx-auto space-y-6 border border-zinc-700"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-400 text-center">
          Add Amount 
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          min="1"
        />

        <button
          type="submit"
          disabled={loading || !amount || Number(amount) <= 0}
          className="w-full bg-green-500 text-white py-3 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl rounded-xl hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Amount'}
        </button>

        {message && (
          <p
            className={`text-center text-sm sm:text-base md:text-lg ${
              message.toLowerCase().includes('success') ? 'text-green-400 font-semibold' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {latestAdded !== null && (
        <div className="mx-auto mt-6 text-center">
          <p className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full px-6 py-3 shadow-lg text-sm sm:text-base md:text-lg">
            Latest added amount: ₹{latestAdded}
          </p>
        </div>
      )}
    </div>
  );
}
