import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // ✅ Ensure i18n is properly imported

export default function AddClient() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '+92',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
 const isUrdu = i18n.language === 'ur';
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      if (!value.startsWith('+92')) return;
      const digits = value.slice(3).replace(/\D/g, '');
      if (digits.length > 10) return;
      setFormData((prev) => ({ ...prev, phoneNumber: '+92' + digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.name || !formData.phoneNumber || !formData.address) {
      setMessage(t('fill_all_fields'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorMsg = t('server_error');
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        setMessage(errorMsg);
        setLoading(false);
        return;
      }

      setMessage(t('added_success'));
      setFormData({ name: '', phoneNumber: '+92', address: '' });
    } catch (error) {
      setMessage(t('server_error'));
    }

    setLoading(false);
  };

  return (
    <div className="mt-8 mx-2">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 shadow-2xl rounded-2xl p-4 sm:p-8 md:p-10 lg:p-12 max-w-2xl w-full mx-auto space-y-2 border border-zinc-700"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-400 text-center auto-dir text-center">
          {t('add_client')}
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('client_name')}
          className={`w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400 auto-dir
          ${isUrdu ? 'text-right' : 'text-left'}`}
          required
        />

        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+92XXXXXXXXXX"
          className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400 auto-dir"
         
          required
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder={t('address')}
          className={`w-full bg-zinc-800 text-white border border-zinc-600 rounded-xl px-4 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-400 auto-dir
          ${isUrdu ? 'text-right' : 'text-left'}`}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl rounded-xl hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed auto-dir text-center"
        >
          {loading ? t('adding') : t('add')}
        </button>

        {message && (
          <p
            className={`auto-dir text-base font-semibold text-center ${
              message.toLowerCase().includes('success') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
