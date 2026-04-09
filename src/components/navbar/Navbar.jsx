import './Navbar.css';
import logo from '../../assets/symbol.png';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchwt from '../../assets/search.svg';
import addBtn from '../../assets/addButton.png';
import Avatar from '../../assets/avatar.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';

export default function Navbar({ toggleModal, status, toggleModalSell, onCategorySelect }) {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div>
      <nav className="fixed z-50 w-full p-2 px-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white flex items-center justify-between gap-1 md:gap-2">
        <div className="flex items-center flex-shrink-0">
          <img src={logo} alt="Logo" className="w-12 mr-2 cursor-pointer" />
          
          <div className="relative hidden lg:block">
            <img src={search} alt="Search" className="absolute top-1/2 -translate-y-1/2 left-2 w-5" />
            <input
              type="text"
              placeholder="Search city..."
              className="w-[200px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md focus:outline-none focus:border-teal-300"
            />
            <img src={arrow} alt="Arrow" className="absolute top-1/2 -translate-y-1/2 right-3 w-5 cursor-pointer" />
          </div>
        </div>

        <div className="flex-grow flex items-center relative max-w-4xl mx-1 md:mx-2">
          <input
            type="text"
            placeholder="Find Cars, Mobile phones, and More..."
            className="w-full p-3 pr-12 border-black border-2 border-solid rounded-md focus:outline-none focus:border-teal-300"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 md:bg-[#002f34] bg-transparent md:p-1 p-0 rounded cursor-pointer hover:bg-[#003f45]">
            <img src={searchwt} alt="Search-icon" className="w-6 md:invert-0 invert" />
          </div>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none p-2 rounded hover:bg-slate-200">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center cursor-pointer hover:bg-slate-200 p-1 px-2 rounded">
            <p className="font-bold mr-1">English</p>
            <img src={arrow} alt="Arrow" className="w-5" />
          </div>

          {user ? (
            <div className="relative" ref={profileRef}>
              <div 
                className="flex items-center cursor-pointer hover:bg-slate-200 p-1 px-2 rounded-full border-2 border-transparent hover:border-teal-300 transition-all"
                onClick={toggleProfile}
              >
                <img src={Avatar} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
                <img src={arrow} alt="Arrow" className={`w-4 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[60] py-4">
                  <div className="px-4 pb-4 border-b border-gray-100 flex flex-col items-center">
                    <img src={Avatar} alt="Profile Large" className="w-16 h-16 rounded-full mb-2 border-2 border-teal-100" />
                    <p className="text-[#002f34] font-bold text-center">Welcome back,</p>
                    <p className="text-[#002f34] text-center mb-1">{user.displayName || 'User'}</p>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[#002f34] font-bold flex items-center"
                    >
                      <span className="ml-2 underline">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="font-bold underline text-[#002f34] hover:no-underline"
              onClick={toggleModal}
            >
              Login
            </button>
          )}

          <div className='relative ml-2 flex-shrink-0'>
            <img
              src={addBtn}
              onClick={user ? toggleModalSell : toggleModal}
              className="w-24 shadow-md rounded-full cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
              alt="Add Button"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed z-50 w-full bg-slate-100 shadow-md p-4 top-[68px]">
          <div className="flex flex-col space-y-4">
            {user ? (
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-inner">
                <img src={Avatar} alt="Profile Mobile" className="w-16 h-16 rounded-full border-2 border-teal-300 mb-2" />
                <p className="text-[#002f34] font-bold">Welcome back,</p>
                <p className="text-[#002f34] mb-4 text-center">{user.displayName || 'User'}</p>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 bg-slate-200 rounded font-bold text-[#002f34]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="w-full py-3 bg-teal-300 rounded font-bold text-[#002f34]"
                onClick={() => {
                  toggleModal();
                  setIsMenuOpen(false);
                }}
              >
                Login
              </button>
            )}

            <div className="pt-2 border-t border-gray-200">
              <button 
                onClick={() => {
                  user ? toggleModalSell() : toggleModal();
                  setIsMenuOpen(false);
                }}
                className="w-full py-3 bg-white border-2 border-dashed border-[#002f34] rounded-full flex items-center justify-center font-bold"
              >
                <span className="text-xl mr-2 text-teal-500">+</span> SELL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists">
        <ul className="list-none flex items-center justify-between w-full">
          <div
            className="flex flex-shrink-0 cursor-pointer" 
            onClick={() => onCategorySelect(null)} 
          >
            <p className="font-semibold uppercase all-cats"> All categories</p>
            <img className="w-4 ml-2" src={arrow} alt="Arrow" />
          </div>

          <li className="cursor-pointer" onClick={() => onCategorySelect('Cars')}>Cars</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('Shirt')}>Shirt</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('Shoes')}>Shoes</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('Apartment')}>For sale: Houses & Apartments</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('Scooter')}>Scooter</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('Commercial & Other Vehicles')}>Commercial & Other Vehicles</li>
          <li className="cursor-pointer" onClick={() => onCategorySelect('For rent: Houses & Apartments')}>For rent: Houses & Apartments</li>
        </ul>
      </div>
    </div>
  );
}