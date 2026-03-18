import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { createContext } from 'react';
import {
  IoHomeOutline,
  IoSearchOutline,
  IoBagOutline,
  IoGridOutline,
  IoAddCircleOutline,
  IoFilterOutline,
} from 'react-icons/io5';

export const SearchContext = createContext({
  searchQuery: '',
  showFilter: false,
});

function NavItem({ to, children, end, icon }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className="relative text-gray-400 hover:text-white transition-colors duration-200"
      >
        {({ isActive }) => (
          <>
            <span className={` sm:hidden ${isActive ? 'text-white' : ''}`}>
              {icon}
            </span>
            <span
              className={` hidden sm:inline ${isActive ? 'text-white' : ''}`}
            >
              {children}
            </span>
            {isActive && (
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-[#FF4760] to-[#FF4385]"
              />
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

const navLinks = [
  {
    label: 'Home',
    to: '/dashboard',
    end: true,
    icon: <IoHomeOutline size={30} />,
  },
  {
    label: 'Browse',
    to: '/dashboard/browse',
    end: false,
    icon: <IoSearchOutline size={30} />,
  },
  {
    label: 'My Purchases',
    to: '/dashboard/purchases',
    end: false,
    icon: <IoBagOutline size={30} />,
  },
  {
    label: 'My Products',
    to: '/dashboard/products',
    end: false,
    icon: <IoGridOutline size={30} />,
  },
  {
    label: 'Sell',
    to: '/dashboard/sell',
    end: false,
    icon: <IoAddCircleOutline size={30} />,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
  }, []);
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const location = useLocation();
  const isBrowse = location.pathname === '/dashboard/browse';
  return (
    <div className="min-h-screen bg-[hsl(0,0%,85%)] flex flex-col">
      <nav className="text-black flex justify-between items-center py-4 px-4 md:px-40 bg-[#EBEBEB] shadow border-b border-black gap-3">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="font-bold flex-none text-3xl md:text-4xl">
            NEX
            <span className="bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
              US
            </span>
          </div>
        </div>
        {isBrowse && (
          <div className="flex w-full md:grow md:mx-8 relative">
            <input
              className="bg-[#d6d6d6] w-full sm:px-5 rounded-full outline-none p-2"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <FaMagnifyingGlass className="text-2xl absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        )}

        <div className=" flex flex-none items-center gap-10 text-xl">
          <div className="hidden md:block">
            {user ? user.email.split('@')[0] : 'loading...'}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleLogout}
              className="border-black border p-1 px-3 bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex w-full px-4 md:px-40 bg-[#292929] text-white py-2">
        <ul className="flex w-full gap-8 sm:gap-12 justify-center sm:justify-start">
          {navLinks.map(link => (
            <NavItem
              key={link.label}
              to={link.to}
              end={link.end}
              icon={link.icon}
            >
              {link.label}
            </NavItem>
          ))}
        </ul>
        {isBrowse && (
          <div class>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 text-sm bg-[#F0F0F0] text-gray-500 px-2 py-1 rounded-2xl  "
            >
              <IoFilterOutline /> Filter
            </button>
          </div>
        )}
      </div>
      <SearchContext.Provider value={{ searchQuery, showFilter }}>
        <Outlet />
      </SearchContext.Provider>
    </div>
  );
}
