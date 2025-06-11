import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, toUser } = location.state || {};

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (toUser) {
      fetchTransactions();
    }
  }, [toUser]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/transactions/${toUser}`);
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-zinc-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Transaction History</h2>

      {loading && <p className="text-center text-gray-400">Loading transactions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="text-center text-gray-400">No transactions found.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-zinc-800 text-gray-300">
                <th className="px-4 py-3 border-b border-gray-700 text-left">Client Name</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left">Amount (₹)</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left">Type</th>
                  <th className="px-4 py-3 border-b border-gray-700 text-left">Reason</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left">Date</th>

             
              </tr>
            </thead>
            <tbody>
              {transactions.map(({ _id, date, type, amount, reason, toUser, clientName }) => (
                <tr
                  key={_id}
                  className="hover:bg-zinc-800 transition-colors duration-200"
                >
                  <td className="px-4 py-3 border-b border-gray-800">{clientName}</td>
                  <td className="px-4 py-3 border-b border-gray-800">₹ {amount}</td>
                           <td
                    className={`px-4 py-3 border-b border-gray-800 font-semibold ${type === 'send' ? 'text-red-400' : 'text-green-400'
                      }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </td>
                     <td className="px-4 py-3 border-b border-gray-800">{reason}</td>
                  <td className="px-4 py-3 border-b border-gray-800">{formatDate(date)}</td>
             
               
             
    
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
