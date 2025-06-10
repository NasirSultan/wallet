import { useEffect, useState } from 'react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch clients
        const clientsRes = await fetch('http://localhost:3000/api/client');
        if (!clientsRes.ok) throw new Error('Failed to fetch clients');
        const clientsData = await clientsRes.json();

        // Create a map from userId to name
        const clientsMap = {};
        clientsData.forEach(client => {
          clientsMap[client._id] = client.name;
        });
        setClients(clientsMap);

        // Fetch transactions
        const transRes = await fetch('http://localhost:3000/api/transactions');
        if (!transRes.ok) throw new Error('Failed to fetch transactions');
        const transData = await transRes.json();

        setTransactions(transData);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
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
              <th className="border border-gray-300 px-4 py-2">To User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(({ _id, date, type, amount, reason, toUser }) => (
              <tr key={_id} className="text-center hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{formatDate(date)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold ${
                    type === 'send' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">{amount}</td>
                <td className="border border-gray-300 px-4 py-2">{reason}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {clients[toUser] || toUser}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
