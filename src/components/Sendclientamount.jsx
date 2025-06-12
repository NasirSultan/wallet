import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // ✅ Ensure i18n is properly imported
export default function SendPaymentForm() {
  const { t } = useTranslation();
  const location = useLocation();
  const { clientId = '', clientName = '' } = location.state || {};
  const [toUser] = useState(clientId);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const isUrdu = i18n.language === 'ur';
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      t('sendamount.confirmMessage', { amount, clientName })
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage('');

    try {
      await axios.post('https://wallet-backend-chi-ten.vercel.app/api/send-to-user', {
        toUser,
        amount: Number(amount),
        reason,
      });

      setMessage(t('sendamount.success'));
      setAmount('');
      setReason('');
    } catch (error) {
      console.error('Error sending payment:', error);
      setMessage(t('sendamount.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-900 text-white shadow-lg rounded-xl border border-gray-700">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-4 text-center">
          {t('sendamount.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          <div className="text-xs sm:text-sm text-gray-400 text-center">
            {t('sendamount.sendingTo')}{' '}
            <span className="text-white font-bold">{clientName}</span>
          </div>

          <div>
            <input
              type="number"
              value={amount}
              placeholder={t('sendamount.enterAmount')}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className={`w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
                      ${isUrdu ? 'text-right' : 'text-left'}
              `}
            />
          </div>

          <div>
            <input
              type="text"
              value={reason}
              placeholder={t('sendamount.enterReason')}
              onChange={(e) => setReason(e.target.value)}
              required
              className={`w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500
                    ${isUrdu ? 'text-right' : 'text-left'}
              `}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
              loading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {loading ? t('sendamount.sending') : t('sendamount.sendPayment')}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium text-sm sm:text-base ${
              message.includes('success') || message.includes('کامیابی') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
