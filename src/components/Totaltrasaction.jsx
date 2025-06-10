import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('http://localhost:3000/api/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Transaction History</h2>

      {loading && <p className="text-center text-gray-600">Loading transactions...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="text-center text-gray-500">No transactions found.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Amount (₹)</th>
              <th className="border border-gray-300 px-4 py-2">Reason</th>
              <th className="border border-gray-300 px-4 py-2">To User ID</th>
              <th className="border border-gray-300 px-4 py-2">Client Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(({ _id, date, type, amount, reason, toUser, clientName }) => (
              <tr key={_id} className="text-center hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{formatDate(date)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold ${
                    type === 'send' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">₹ {amount}</td>
                <td className="border border-gray-300 px-4 py-2">{reason}</td>
                <td className="border border-gray-300 px-4 py-2 font-mono">{toUser}</td>
                <td className="border border-gray-300 px-4 py-2">{clientName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to="/clienttransaction"
                    state={{ name: clientName, toUser: toUser }}
                    className="text-blue-600 underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
