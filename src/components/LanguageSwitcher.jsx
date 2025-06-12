import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  return (
    <div className="flex items-center justify-center  mt-20 px-4">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-4xl font-bold text-white-800 text-center">
          {lang === 'en' ? 'Choose Language' : 'زبان منتخب کریں'}
        </h2>

        <div
          onClick={toggleLanguage}
          className="relative w-36 h-16 bg-gradient-to-r from-blue-700 to-green-500 rounded-full cursor-pointer shadow-lg flex items-center px-2 transition-all duration-300"
        >
          {/* Toggle Ball */}
          <div
            className={`absolute top-2 left-2 w-12 h-12 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              lang === 'ur' ? 'translate-x-16' : 'translate-x-0'
            }`}
          />

          {/* Labels */}
          <div className="w-full flex justify-between items-center px-4 z-10 text-white font-semibold text-lg select-none">
            <span>EN</span>
            <span className="text-right">اردو</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
