import { useEffect, useState } from 'react';
import { FaWallet, FaArrowDown, FaArrowUp, FaMoneyBillWave } from 'react-icons/fa'; 
export default function BalanceSummary() {
  const [balanceSummary, setBalanceSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/balance-summary')
      .then(response => response.json())
      .then(data => setBalanceSummary(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  if (!balanceSummary) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <section className="flex justify-center bg-gray-100 p-4 py-20">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side: Wallet Summary Heading */}
<div className="text-left space-y-8 flex flex-col justify-center items-start h-full">
  <h2 className="text-6xl md:text-6xl font-extrabold flex items-center justify-start gap-6 bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
    <span>Wallet Summary</span>
  </h2>
  <p className="text-xl md:text-2xl text-gray-600">Overview of your wallet activity</p>
</div>

    {/* Right side: Cards */}
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-gray-800 text-white p-6 shadow rounded-xl flex items-center">
        <div className="w-[148px] flex justify-center">
          <FaWallet size={78} />
        </div>
<div className="flex flex-col flex-1 items-center">
  <h6 className="text-lg md:text-xl mb-2 font-semibold">Balance</h6>
  <p className="text-3xl md:text-4xl font-extrabold">₹{balanceSummary.balance}</p>
</div>

      </div>

      {/* Received & Sent in single row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-6 shadow rounded-xl flex flex-col items-center">
          <FaArrowDown size={32} className="mb-2" />
          <h6 className="text-base mb-1">Received</h6>
          <p className="text-xl font-semibold">₹{balanceSummary.totalReceivedFromUsers}</p>
        </div>

        <div className="bg-red-500 text-white p-6 shadow rounded-xl flex flex-col items-center">
          <FaArrowUp size={32} className="mb-2" />
          <h6 className="text-base mb-1">Sent</h6>
          <p className="text-xl font-semibold">₹{balanceSummary.totalSent}</p>
        </div>
      </div>

      {/* Total Added */}
      <div className="bg-green-500 text-white p-6 shadow rounded-xl flex flex-col items-center">
        <FaMoneyBillWave size={36} className="mb-3" />
        <h6 className="text-base mb-2">Total Added Amount</h6>
        <p className="text-2xl font-bold">₹{balanceSummary.totalAdded}</p>
      </div>
    </div>
  </div>
</section>



  );
}
