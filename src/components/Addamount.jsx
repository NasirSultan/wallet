import { useState, useEffect } from 'react';

export default function AddAmount() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestAmount, setLatestAmount] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('http://localhost:3000/api/latest-transaction');
        if (!res.ok) throw new Error('Failed to fetch latest transaction');
        const data = await res.json();
        if (data && data.amount !== undefined) {
          setLatestAmount(data.amount);
          localStorage.setItem('latestAmount', data.amount); // Save to localStorage
        }
      } catch (error) {
        // If backend fetch fails, try loading from localStorage
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
      localStorage.setItem('latestAmount', amount); // persist in localStorage
      setAmount('');
    } catch (error) {
      setMessage('Network or server error occurred');
    }

    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 max-w-md mx-auto mt-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
          Add Amount to Wallet
        </h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          min="1"
        />
        <button
          type="submit"
          disabled={loading || !amount || Number(amount) <= 0}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Amount'}
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

      {latestAmount !== null && (
        <p className="max-w-md mx-auto mt-4 text-center text-lg font-medium text-blue-700">
          Latest added amount: ₹{latestAmount}
        </p>
      )}
    </>
  );
}
