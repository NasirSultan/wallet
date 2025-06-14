import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react'; // or from wherever you're using icons

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
  const [showCalculator, setShowCalculator] = useState(false);
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('+');
  const [calcResult, setCalcResult] = useState(null);

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
  const calculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    let res = 0;
    switch (operator) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b !== 0 ? a / b : '∞'; break;
      default: res = 0;
    }
    setCalcResult(res);
    setAmount(res.toString()); // Optional: auto-fill the amount field
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
            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${loading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
          >
            {loading ? t('sendamount.sending') : t('sendamount.sendPayment')}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium text-sm sm:text-base ${message.includes('success') || message.includes('کامیابی') ? 'text-green-400' : 'text-red-400'
              }`}
          >
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => setShowCalculator(true)}
        className="fixed bottom-[168px] right-6 bg-green-500/30 backdrop-blur text-white rounded-full p-4 shadow-lg border border-green-300/50 z-50"
      >
        <Calculator size={18} />

      </button>



      {/* Calculator Modal */}
      {showCalculator && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCalculator(false)}
        >
          <div
            className="bg-black text-white rounded-xl shadow-2xl p-4 w-[95%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h3 className="text-center text-blue-400 text-lg sm:text-xl font-bold mb-4">
              {t('Simple Calculator') || 'Simple Calculator'}
            </h3>

            {/* Single Row Layout */}
            <div className="flex flex-wrap gap-2 justify-center items-center text-sm sm:text-base">
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder={t('1st Amount') || 'First'}
                className="px-3 py-2 rounded bg-zinc-800 text-white placeholder-gray-400 w-28 sm:w-32"
              />

              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="px-3 py-2 rounded bg-zinc-800 text-white text-center w-12 sm:w-14"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>

              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder={t('2nd Amount') || 'Second'}
                className="px-3 py-2 rounded bg-zinc-800 text-white placeholder-gray-400 w-28 sm:w-32"
              />

              <div className="w-[95%]  flex flex-row gap-2 mt-4 mx-4">
                <button
                  onClick={calculate}
                  className="w-full px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  {t('Calculate') || 'Calculate'}
                </button>

                <button
                  onClick={() => {
                    setNum1('');
                    setNum2('');
                    setCalcResult(null);
                  }}
                  className="w-full px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-medium"
                >
                  {t('Clear') || 'Clear'}
                </button>
              </div>

            </div>

            {/* Output Result */}
            {calcResult !== null && (
              <div
                onClick={() => setNum1(calcResult.toString())}
                className="mt-4 mx-4 text-center bg-green-900 text-green-200 px-4 py-1 rounded cursor-pointer hover:bg-green-800 transition font-semibold"
                title="Click to set result as first input"
              >
                {t('Result') || 'Result'}: {calcResult}
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
