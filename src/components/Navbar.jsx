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
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Top Navbar - visible on md and larger */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-blue-600 text-white py-4 px-6 shadow z-50 justify-between items-center">
        <div className="font-bold text-xl">My App</div>
        <div className="flex space-x-6">
          <Link to="/" className={isActive('/') ? 'text-yellow-300' : 'hover:text-gray-300'}>
            Summary
          </Link>
          <Link
            to="/addamount"
            className={isActive('/addamount') ? 'text-yellow-300' : 'hover:text-gray-300'}
          >
            Add Amount
          </Link>
          <Link
            to="/addclient"
            className={isActive('/addclient') ? 'text-yellow-300' : 'hover:text-gray-300'}
          >
            Add Client
          </Link>
          <Link
            to="/allclients"
            className={isActive('/allclients') ? 'text-yellow-300' : 'hover:text-gray-300'}
          >
            All Clients
          </Link>
          <Link to="/contact" className={isActive('/contact') ? 'text-yellow-300' : 'hover:text-gray-300'}>
            Contact
          </Link>
        </div>
      </nav>

      {/* Bottom Navbar - visible on small screens */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full bg-blue-600 text-white py-2 px-6 shadow z-50 flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center">
          <Home size={20} />
          <span className="text-xs">Summary</span>
        </Link>
        <Link to="/addamount" className="flex flex-col items-center">
          <PlusCircle size={20} />
          <span className="text-xs">Add</span>
        </Link>
        <Link to="/allclients" className="flex flex-col items-center">
          <Users size={20} />
          <span className="text-xs">Clients</span>
        </Link>
        <Link to="/sendclientamount" className="flex flex-col items-center">
          <Send size={20} />
          <span className="text-xs">Send</span>
        </Link>
        <Link to="/totaltransactions" className="flex flex-col items-center">
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
