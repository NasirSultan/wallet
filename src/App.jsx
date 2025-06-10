import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BalanceSummary from './components/BalanceSummary';
import Addamount from './components/Addamount';
import AddClient from './components/AddClient';
import AllClient from './components/AllClient';
import Sendclientamount from './components/Sendclientamount';
import Receivedclientamount from './components/Receivedclientamount';
import Totaltrasaction from './components/Totaltrasaction';
import Perclientrasaction from './components/Perclientrasaction';

function Contact() {
  return <h2>Contact Page</h2>;
}

function App() {
  return (
    <>
      <Navbar />
      {/* Add padding to avoid overlap */}
      <div className="pt-16 pb-16">
        <Routes>
          <Route path="/" element={<BalanceSummary />} />
          <Route path="/addamount" element={<Addamount />} />
          <Route path="/addclient" element={<AddClient />} />
          <Route path="/allclients" element={<AllClient />} />
          <Route path="/sendclientamount" element={<Sendclientamount />} />
          <Route path="/receivedclientamount" element={<Receivedclientamount />} />
          <Route path="/totaltransactions" element={<Totaltrasaction />} />
          <Route path="/clienttransaction" element={<Perclientrasaction />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
