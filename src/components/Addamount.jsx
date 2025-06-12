import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddAmount() {
  const { t, i18n } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [latestAdded, setLatestAdded] = useState(null);

  const isUrdu = i18n.language === 'ur';

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
      setMessage(t('addAmount.invalid'));
      return;
    }

    const confirmSubmit = window.confirm(t('addAmount.confirm', { amount: numericAmount }));
    if (!confirmSubmit) return;

    setLoading(true);

    try {
      const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/balance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t('addAmount.failed'));
      }

      await res.json();
      setLatestAdded(numericAmount);
      localStorage.setItem('latestAdded', numericAmount);
      setMessage(t('addAmount.success'));
      setAmount('');
    } catch (err) {
      setMessage(err.message || t('addAmount.error'));
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-2xl w-full mx-auto space-y-6 border border-zinc-700"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-400 text-center auto-dir text-center">
          {t('addAmount.title')}
        </h2>

        {/* Input */}
<input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder={t('addAmount.placeholder')}
  className={`appearance-none w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400 auto-dir ${
    isUrdu ? 'text-right' : 'text-left'
  }`}
  required
  min="1"
/>




        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount || Number(amount) <= 0}
          className="w-full bg-green-500 text-white py-3 md:py-3 text-lg sm:text-xl md:text-2xl rounded-xl hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('addAmount.loading') : t('addAmount.button')}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`text-sm sm:text-base md:text-lg auto-dir text-center ${
              message.toLowerCase().includes('success') || message.includes(t('addAmount.success'))
                ? 'text-green-400 font-semibold'
                : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* Latest Added */}
      {latestAdded !== null && (
        <div className="mx-auto mt-6 text-center">
          <p className="inline-block bg-gradient-to-r from-red-800 to-red-800 text-white font-semibold rounded-full px-6 py-3 shadow-lg text-sm sm:text-base md:text-lg auto-dir text-center">
            {t('addAmount.latestAdded', { amount: latestAdded })}
          </p>
        </div>
      )}
    </div>
  );
}
