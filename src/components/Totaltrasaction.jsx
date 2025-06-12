import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';

export default function TransactionHistory() {
  const { t, i18n } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('https://wallet-backend-chi-ten.vercel.app/api/transactions');
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
    return date.toLocaleString(i18n.language === 'ur' ? 'ur-PK' : 'en-US');
  };

  const filteredTransactions = transactions.filter((txn) => {
    const nameMatch = txn.clientName?.toLowerCase().includes(searchName.toLowerCase());
    const txnDate = new Date(txn.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const dateMatch =
      (!start || txnDate >= start) &&
      (!end || txnDate <= end);
    const validAmount = Number(txn.amount) !== 1;
    return nameMatch && dateMatch && validAmount;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(t('title'), 14, 10);

    const tableColumn = [
      t("name"),
      t("payment"),
      t("type"),
      t("reason"),
      t("date")
    ];

    const tableRows = filteredTransactions.map(txn => [
      txn.clientName,
      `₹ ${txn.amount}`,
      txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
      txn.reason,
      formatDate(txn.date),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("transaction_history.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 py-6 bg-zinc-900 text-white rounded-lg shadow-lg">
      {/* Language Switcher */}
     
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">{t('title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={`w-full px-4 py-2 rounded bg-zinc-800 ${
            !startDate ? 'text-gray-400' : 'text-white'
          } border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`w-full px-4 py-2 rounded bg-zinc-800 ${
            !endDate ? 'text-gray-400' : 'text-white'
          } border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
        />
        <button
          onClick={() => {
            setSearchName('');
            setStartDate('');
            setEndDate('');
          }}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-semibold"
        >
          {t('clearFilters')}
        </button>
        <button
          onClick={exportPDF}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        >
          {t('exportPDF')}
        </button>
      </div>

      {loading && <p className="text-center text-gray-400">{t('loading')}</p>}
      {error && <p className="text-center text-red-500">{t('error')}</p>}

      {!loading && !error && filteredTransactions.length === 0 && (
        <p className="text-center text-gray-400">{t('noTransactions')}</p>
      )}

      {!loading && !error && filteredTransactions.length > 0 && (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-zinc-800 text-gray-300">
                <th className="px-4 py-3 border-b border-gray-700 text-left w-1/5">{t('name')}</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left w-1/5">{t('payment')}</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left w-1/5">{t('type')}</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left w-1/5">{t('reason')}</th>
                <th className="px-4 py-3 border-b border-gray-700 text-left w-1/5">{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(({ _id, date, type, amount, reason, clientName }) => (
                <tr key={_id} className="hover:bg-zinc-800 transition-colors duration-200">
                  <td className="px-4 py-3 border-b border-gray-800">{clientName}</td>
                  <td className="px-4 py-3 border-b border-gray-800">{amount}</td>
                  <td className="px-4 py-3 border-b border-gray-800 font-semibold">
                    {type === 'send' ? (
                      <FaArrowUp className="text-red-400" />
                    ) : (
                      <FaArrowDown className="text-green-400" />
                    )}
                  </td>
                  <td
                    className="px-4 py-3 border-b border-gray-800 cursor-pointer underline text-blue-400"
                    onClick={() => setSelectedReason(reason)}
                  >
                    {t('reason')}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-800">{formatDate(date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for showing Reason */}
      {selectedReason && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60"
          onClick={() => setSelectedReason('')}
        >
          <div
            className="bg-zinc-900 text-white rounded-lg p-6 max-w-md w-full text-center shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">{t('transactionReason')}</h3>
            <p>{selectedReason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
