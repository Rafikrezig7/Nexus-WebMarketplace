import { easeOut, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoCaretBackOutline } from 'react-icons/io5';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
export default function SignUp() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username,setUsername]=useState('')
  const navigate = useNavigate();
  async function handleSignUp() {
    const email = `${id}@univ-oran1.dz`;
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        alert(error.message);
        return
      } 
      const{error:profileError}=await supabase.from('profiles').update({username,matricule:id}).eq('id',data.user.id)
      if(profileError){
        alert(profileError.message)
        return
      }
      alert('You signed up!')
      navigate('/signin')
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="flex shadow-xl w-3xl h-auto"
      >
        {/* Left side - gradient */}

        <div className=" relative flex flex-col justify-center items-center gap-4 text-white bg-linear-to-r from-[#FF4760] to-[#FF4385] w-[50%]">
          <div
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 flex items-center gap-1.5 font-semibold cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            <IoCaretBackOutline />
            <p className="text-sm">Go Back</p>
          </div>
          <h1 className="font-bold text-2xl">Welcome Back!</h1>
          <p className="text-sm opacity-80">Already have an account?</p>
          <button
            onClick={() => navigate('/signin')}
            className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-[#FF4760] transition-colors duration-200 text-sm"
          >
            Sign In
          </button>
        </div>

        {/* Right side - form */}
        <div className="bg-white p-10 flex flex-col justify-between w-[55%]">
          <h1 className="font-bold text-2xl text-gray-700 mb-5">Sign Up</h1>

          <div className="flex flex-col gap-4">
            <label className='text-xs font-bold text-gray-500 tracking-widest'>
              USERNAME
              <input
                value={username}
                onChange={e=>setUsername(e.target.value)}
                name='username'
                placeholder='Seal...'
                className='block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-400'
              />
            </label>
            <label className="text-xs font-bold text-gray-500 tracking-widest">
              ID NUMBER
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-400"
                name="matricule"
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
                placeholder="*******"
              />
            </label>

            <label className="text-xs font-bold text-gray-500 tracking-widest">
              CONFIRM PASSWORD
              <input
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                type="password"
                className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-400"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
            </label>

            <button
              onClick={handleSignUp}
              className="w-full py-3 rounded-full text-white font-semibold bg-linear-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
