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
    <div className="max-w-md mx-auto mt-6 p-6 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Details</h2>

      <p className="text-lg text-gray-700 mb-2">
        <strong>Client Name:</strong> {name || 'N/A'}
      </p>
      <p className="text-lg text-gray-700 mb-4">
        <strong>To User ID:</strong> {toUser || 'N/A'}
      </p>

      {loading && <p className="text-blue-500 mb-4">Loading transactions...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="text-gray-500 mb-4">No transactions found.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="text-left space-y-4">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="p-3 border rounded bg-gray-50 shadow-sm"
            >
              <p><strong>Amount:</strong> {txn.amount}</p>
              <p><strong>Reason:</strong> {txn.reason}</p>
              <p><strong>Type:</strong> {txn.type}</p>
              <p><strong>Date:</strong> {new Date(txn.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );
}
