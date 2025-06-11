import { useState, useEffect } from 'react';

export default function AddAmount() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestAmount, setLatestAmount] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/latest-transaction');
        if (!res.ok) throw new Error('Failed to fetch latest transaction');
        const data = await res.json();
        if (data && data.amount !== undefined) {
          setLatestAmount(data.amount);
          localStorage.setItem('latestAmount', data.amount);
        }
      } catch (error) {
        const savedAmount = localStorage.getItem('latestAmount');
        if (savedAmount !== null) {
          setLatestAmount(Number(savedAmount));
        }
        console.error('Error fetching latest transaction:', error);
      }
    }

    fetchLatest();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage('Please enter a valid amount greater than 0');
      return;
    }

    const confirmSubmit = window.confirm(
      `Are you sure you want to add ₹${amount} to your wallet?`
    );
    if (!confirmSubmit) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/balance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to add amount';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        setMessage(errorMsg);
        setLoading(false);
        return;
      }

      setMessage('Successfully submitted!');
      setLatestAmount(Number(amount));
      localStorage.setItem('latestAmount', amount);
      setAmount('');
    } catch (error) {
      setMessage('Network or server error occurred');
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
          Add Amount to Wallet
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
              message.toLowerCase().includes('successfully')
                ? 'text-green-400 font-semibold'
                : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {latestAmount !== null && (
        <div className=" mx-auto mt-6 text-center">
          <p className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full px-6 py-3 shadow-lg text-sm sm:text-base md:text-lg">
            Latest added amount: ₹{latestAmount}
          </p>
        </div>
      )}
    </div>
  );
}
