import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  Users,
  List,
  ArrowLeft,
  Languages, // updated icon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(); // i18n hook

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
      {/* Top Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-blue-600 text-white py-4 px-6 shadow z-50 justify-between items-center">
        <div className="font-bold text-xl">{t('navbar.title')}</div>
        <div className="flex space-x-6 text-sm">
          <Link to="/" className={navLinkClass('/')}>
            <Home size={18} />
            <span>{t('navbar.home')}</span>
          </Link>
          <Link to="/addamount" className={navLinkClass('/addamount')}>
            <PlusCircle size={18} />
            <span>{t('navbar.addAmount')}</span>
          </Link>
          <Link to="/allclients" className={navLinkClass('/allclients')}>
            <Users size={18} />
            <span>{t('navbar.clients')}</span>
          </Link>
          <Link to="/totaltransactions" className={navLinkClass('/totaltransactions')}>
            <List size={18} />
            <span>{t('navbar.transactions')}</span>
          </Link>
          <Link to="/languageswitcher" className={navLinkClass('/languageswitcher')}>
            <Languages size={18} />
            <span>{t('language')}</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Navbar */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full bg-blue-600 text-white py-2 px-6 shadow z-50 flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-yellow-300' : ''}`}>
          <Home size={20} />
          <span className="text-xs">{t('navbar.home')}</span>
        </Link>
        <Link to="/addamount" className={`flex flex-col items-center ${isActive('/addamount') ? 'text-yellow-300' : ''}`}>
          <PlusCircle size={20} />
          <span className="text-xs">{t('navbar.amount')}</span>
        </Link>
        <Link to="/allclients" className={`flex flex-col items-center ${isActive('/allclients') ? 'text-yellow-300' : ''}`}>
          <Users size={20} />
          <span className="text-xs">{t('navbar.clients')}</span>
        </Link>
        <Link to="/totaltransactions" className={`flex flex-col items-center ${isActive('/totaltransactions') ? 'text-yellow-300' : ''}`}>
          <List size={20} />
          <span className="text-xs">{t('navbar.transactions')}</span>
        </Link>
        <Link to="/languageswitcher" className={`flex flex-col items-center ${isActive('/languageswitcher') ? 'text-yellow-300' : ''}`}>
          <Languages size={20} />
          <span className="text-xs">{t('Language')}</span>
        </Link>
      </nav>

      {/* Back button */}
      {location.pathname !== '/' && (
        <button
          onClick={handleBack}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
          aria-label={t('navbar.back')}
          title={t('navbar.back')}
        >
          <ArrowLeft size={24} />
        </button>
      )}
    </>
  );
};

export default Navbar;
