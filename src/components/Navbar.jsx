import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  Users,
  Send,
  Download,
  List,
  User,
  ArrowLeft,
  Phone,
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleBack = () => {
    navigate(-1);
  };

  const navLinkClass = (path) =>
    `flex items-center space-x-1 ${
      isActive(path) ? 'text-yellow-300 font-semibold' : 'hover:text-gray-300'
    }`;

  return (
    <>
      {/* Top Navbar - visible on md and larger */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-blue-600 text-white py-4 px-6 shadow z-50 justify-between items-center">
        <div className="font-bold text-xl">My App</div>
        <div className="flex space-x-6 text-sm">
          <Link to="/" className={navLinkClass('/')}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/addamount" className={navLinkClass('/addamount')}>
            <PlusCircle size={18} />
            <span>Add Amount</span>
          </Link>
          <Link to="/allclients" className={navLinkClass('/allclients')}>
            <Users size={18} />
            <span>Clients</span>
          </Link>
          <Link to="/totaltransactions" className={navLinkClass('/totaltransactions')}>
            <List size={18} />
            <span>Transactions</span>
          </Link>
          <Link to="/contact" className={navLinkClass('/contact')}>
            <Phone size={18} />
            <span>Contact</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Navbar - visible on small screens */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full bg-blue-600 text-white py-2 px-6 shadow z-50 flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-yellow-300' : ''}`}>
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/addamount" className={`flex flex-col items-center ${isActive('/addamount') ? 'text-yellow-300' : ''}`}>
          <PlusCircle size={20} />
          <span className="text-xs">Amount</span>
        </Link>
        <Link to="/allclients" className={`flex flex-col items-center ${isActive('/allclients') ? 'text-yellow-300' : ''}`}>
          <Users size={20} />
          <span className="text-xs">Clients</span>
        </Link>
       
        <Link to="/totaltransactions" className={`flex flex-col items-center ${isActive('/totaltransactions') ? 'text-yellow-300' : ''}`}>
          <List size={20} />
          <span className="text-xs">Transactions</span>
        </Link>
      </nav>

      {/* Back button fixed at bottom-right */}
      <button
        onClick={handleBack}
        className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeft size={24} />
      </button>
    </>
  );
};

export default Navbar;
