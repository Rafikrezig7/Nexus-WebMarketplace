import { easeOut, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoCaretBackOutline } from 'react-icons/io5';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
export default function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSignIn() {
    const email = `${id}@univ-oran1.dz`;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        alert(error.message);
      } else {
        navigate('/Dashboard');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <div className="min-h-screen bg-[#EBEBEB] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        eas
        className="flex shadow-xl w-3xl h-auto"
      >
        {/* Left side */}
        <div className="relative bg-white p-15 flex flex-col justify-between w-[50%]">
          <div
            onClick={() => navigate('/')}
            className="absolute top-4 left-4  flex items-center gap-1.5 bg-linear-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent  cursor-pointer opacity-80 hover:opacity-100 trancition-opacity duration-200"
          >
            <IoCaretBackOutline style={{ color: '#FF4760' }} />
            <p className="text-sm">Go Back</p>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl text-gray-700 mb-5">Sign In</h1>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-gray-500 tracking-widest">
              ID NUMBER
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-400"
                name="id number"
                placeholder="23********"
              />
            </label>

            <label className="text-xs font-bold text-gray-500 tracking-widest">
              PASSWORD
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-400"
                name="password"
                placeholder="******"
              />
            </label>

            <button
              onClick={handleSignIn}
              className="w-full py-3 rounded-full text-white font-semibold bg-linear-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right side */}
        <div
          className="flex flex-col justify-center items-center gap-4 text-white bg-linear-to-r from-[#FF4760] to-[#FF4385]"
          style={{ width: '45%' }}
        >
          <h1 className="font-bold text-2xl">Welcome to login</h1>
          <p className="text-sm opacity-80">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-[#FF4760] transition-colors duration-200 text-sm"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
}
