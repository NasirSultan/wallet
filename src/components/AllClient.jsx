import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AllClients() {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedClientId, setCopiedClientId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/client');
        if (!res.ok) throw new Error(t('fetch_error'));

        const data = await res.json();
        setClients(data);
        setError('');
      } catch (err) {
        setError(err.message || t('unexpected_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [t]);

  const handleNavigation = (path, clientId, clientName) => {
    navigate(path, { state: { clientId, clientName } });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedClientId(id);
    setTimeout(() => setCopiedClientId(null), 1500);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-black shadow-lg rounded-lg">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-center border-b border-gray-700 pb-2">
        {t('all_clients')}
      </h2>

      <input
        type="text"
        placeholder={t('search_clients')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-center text-white">{t('loading')}</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && filteredClients.length === 0 && (
        <p className="text-center text-gray-400">{t('no_clients')}</p>
      )}

      <ul className="space-y-4">
        {filteredClients.map((client) => (
          <li key={client._id} className="border border-gray-700 rounded-lg p-4 bg-gray-900 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-gray-800 p-6 rounded-full">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A11.954 11.954 0 0112 15c2.387 0 4.604.7 6.48 1.904M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-2xl font-bold text-white">{client.name}</p>

                <div className="mt-3 space-y-2">
                  <div
                    className="text-blue-400 text-lg flex items-center gap-2 justify-center md:justify-start cursor-pointer hover:text-blue-300 transition"
                    title={t('copy_phone')}
                    onClick={() => copyToClipboard(client.phoneNumber, client._id)}
                  >
                    <span>{client.phoneNumber}</span>
                    {copiedClientId === client._id && (
                      <span className="text-green-300 text-sm ml-2">{t('copied')}</span>
                    )}
                  </div>

                  <p className="text-green-300 text-lg">
                    <span className="select-text">{client.address}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleNavigation('/receivedclientamount', client._id, client.name)}
                className="w-1/2 bg-green-800 text-white text-sm px-3 py-1.5 rounded-2xl hover:bg-green-900 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            
              </button>

              <button
                onClick={() => handleNavigation('/sendclientamount', client._id, client.name)}
                className="w-1/2 bg-red-800 text-white text-sm px-3 py-1.5 rounded-2xl hover:bg-red-900 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/addclient')}
        className="fixed bottom-[168px] right-6 bg-green-500/30 backdrop-blur text-white rounded-full p-4 shadow-lg border border-green-300/50 z-50"
        aria-label={t('add_client')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
