import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { createContext } from 'react';
import {
  IoHomeOutline,
  IoSearchOutline,
  IoBagOutline,
  IoGridOutline,
  IoFilterOutline,
  IoCloudUploadOutline,
  IoShieldOutline,
} from 'react-icons/io5';

export const SearchContext = createContext({ searchQuery: '', showFilter: false });

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
            <span className={`sm:hidden ${isActive ? 'text-white' : ''}`}>{icon}</span>
            <span className={`hidden sm:inline ${isActive ? 'text-white font-semibold' : ''}`}>{children}</span>
            {isActive && (
              <motion.div
                layoutId="activeLink"
                initial={{ scaleX: 0 }}
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
  { label: 'Home', to: '/dashboard', end: true, icon: <IoHomeOutline size={24} /> },
  { label: 'Browse', to: '/dashboard/browse', end: false, icon: <IoSearchOutline size={24} /> },
  { label: 'My Purchases', to: '/dashboard/purchases', end: false, icon: <IoBagOutline size={24} /> },
  { label: 'My Products', to: '/dashboard/products', end: false, icon: <IoGridOutline size={24} /> },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin,setIsAdmin]=useState(false)
 
  useEffect(()=>{
    if(!user)return 
    async function checkAdmin(){
      const{data,error}=await supabase.from('profiles').select('role').eq('id',user.id).single()
       console.log('profile data:', data)
  console.log('profile error:', error)
      if(data?.role==='admin')setIsAdmin(true)
       
    }
  checkAdmin()
  },[user])

  async function handleAdminRequest(){
    const {error}=await supabase.from('admin_requests').insert({user_id:user.id, status:'pending'})
    if(error){alert(error.message)}else{
      alert('Application was sent . check contacts for more info !')
    }
  }

  const navigate = useNavigate();
  const location = useLocation();
  const isBrowse = location.pathname === '/dashboard/browse';

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

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('#profile-dropdown')) setShowDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className=" min-h-screen bg-[#EBEBEB] flex flex-col">
      <div className='sticky top-0 z-50'> {/* navbar tg3d las9a lfog malgre nscroli */}
      <nav className="flex justify-between items-center py-3 px-6 md:px-20 bg-white shadow-sm border-b border-gray-200 gap-4">
        <div onClick={() => navigate('/dashboard')} className="cursor-pointer font-bold flex-none text-3xl tracking-tight">
          NEX<span className="bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">US</span>
        </div>


        <AnimatePresence>
          {isBrowse && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 mx-4 relative"
            >
              <input
                className="bg-[#F0F0F0] w-full px-5 pr-10 rounded-full outline-none py-2 text-sm text-gray-600"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-none items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/sell')}
            className="hidden md:flex items-center gap-2 text-white text-sm font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] px-4 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 shadow-sm"
          >
            <IoCloudUploadOutline size={18} /> Upload
          </motion.button>

          <div id="profile-dropdown" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF4760] to-[#FF4385] flex items-center justify-center cursor-pointer text-white font-bold text-sm shadow-md"
            >
              {user ? user.email.split('@')[0].slice(0, 2) : '..'}
            </motion.div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 z-50 w-52 border border-gray-100"
                >

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4760] to-[#FF4385] flex items-center justify-center text-white font-bold text-xs">
                      {user ? user.email.split('@')[0].slice(0, 2) : '..'}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {user ? user.email.split('@')[0] : ''}
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <button onClick={handleAdminRequest} className="text-sm text-left text-gray-600 hover:text-[#FF4760] transition-colors duration-200 py-1">
                     Apply for Admin
                  </button>

                  <hr className="border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="text-sm text-left text-red-400 hover:text-red-600 transition-colors duration-200 py-1"
                  >
                     Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>


      <div className="flex items-center w-full px-6 md:px-20 bg-[#1E1E2E] text-white py-2 gap-4">
        <ul className="flex flex-1 gap-6 sm:gap-10 justify-center sm:justify-start">
          {navLinks.map(link => (
            <NavItem key={link.label} to={link.to} end={link.end} icon={link.icon}>
              {link.label}
            </NavItem>
            
          ))}
          {isAdmin && (
            <NavItem to='/Admin' end={false} icon={<IoShieldOutline size={24}/>}>Admin</NavItem>
          )}
        </ul>

        {isBrowse && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors duration-200"
          >
            <IoFilterOutline size={14} /> Filter
          </motion.button>
        )}
      </div>
      </div>

      <SearchContext.Provider value={{ searchQuery, showFilter }}>
        <Outlet />
      </SearchContext.Provider>
    </div>
  );
}