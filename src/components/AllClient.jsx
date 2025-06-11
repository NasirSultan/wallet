import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/client');
        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }

        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchClients();
  }, []);

  const handleViewClient = (clientId, clientName) => {
    setSelectedClientName(clientName);
    navigate('/receivedclientamount', { state: { clientId, clientName } });
  };

  const handleReceiveAmount = (clientId, clientName) => {
    setSelectedClientName(clientName);
    navigate('/sendclientamount', { state: { clientId, clientName } });
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-black shadow-lg rounded-lg relative">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-center border-gray-700 pb-2">
        All Clients
      </h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-white">Loading clients...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && clients.length === 0 && (
        <p className="text-center text-gray-400">No clients found.</p>
      )}

      {!loading && !error && clients.length > 0 && (
        <ul className="space-y-4">
          {clients
            .filter((client) =>
              client.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((client) => (
              <li
                key={client._id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-900 shadow-sm"
              >
                {/* Row 1: Icon + Info */}
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row items-center gap-4">
                  {/* Icon */}
                  <div className="w-full sm:w-full md:w-1/3 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-full">
                      <svg
                        className="w-20 h-20 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A11.954 11.954 0 0112 15c2.387 0 4.604.7 6.48 1.904M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full sm:w-full md:w-2/3 text-center md:text-left">
                    <p className="text-3xl font-extrabold text-white">{client.name}</p>
                    <div className="mt-4">
                      <p className="text-xl text-gray-300">
                        Phone - {client.phoneNumber}
                      </p>
                      <p className="text-xl text-gray-300 mt-2">
                        Address - {client.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Actions */}
                <div className="mt-4 flex flex-row gap-2">
                  <button
                    onClick={() => handleViewClient(client._id, client.name)}
                    className="w-1/2 flex items-center justify-center bg-blue-600 text-white text-sm px-3 py-1.5 rounded-2xl hover:bg-blue-700 transition"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  
                  </button>

                  <button
                    onClick={() => handleReceiveAmount(client._id, client.name)}
                    className="w-1/2 flex items-center justify-center bg-green-600 text-white text-sm px-3 py-1.5 rounded-2xl hover:bg-green-700 transition"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
    
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* Floating Add Client Button */}
      <button
        onClick={() => navigate('/addclient')}
        className="fixed bottom-42 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50"
        aria-label="Add Client"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
