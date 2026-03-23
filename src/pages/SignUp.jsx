import { easeOut, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoCaretBackOutline } from 'react-icons/io5';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SignUp() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    if (!id || !password || !username) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    const email = `${id}@univ-oran1.dz`;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, matricule: id })
        .eq('id', data.user.id);

      if (profileError) {
        alert(profileError.message);
        setLoading(false);
        return;
      }

      alert('You signed up!');
      navigate('/signin');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex justify-center items-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        // flex-col-reverse ensures Form is on TOP on mobile, 
        // md:flex-row restores Gradient Left / Form Right on desktop
        className="flex flex-col-reverse md:flex-row bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden min-h-[600px]"
      >
        {/* Left Side (Desktop) - Gradient Banner */}
        <div className="w-full md:w-[45%] flex flex-col justify-center items-center p-8 md:p-12 text-white bg-gradient-to-br from-[#FF4760] to-[#FF4385] relative overflow-hidden">
       
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 text-center space-y-4">
            <h1 className="font-bold text-3xl md:text-4xl">Welcome</h1>
            <p className="text-sm md:text-base opacity-90 font-light">
              Already have an account?
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="mt-4 border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-[#FF4760] transition-all duration-300 text-sm font-bold tracking-wide"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
        
          <div
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-4 md:left-4 flex items-center gap-2 cursor-pointer group"
          >
            <div className=" rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <IoCaretBackOutline className="text-[#FF4760]" size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-600 group-hover:text-[#FF4760] transition-colors">
              Go Back
            </p>
          </div>

          <div className="mt-12 md:mt-0">
            <h1 className="font-bold text-3xl text-gray-800 mb-2">Sign Up</h1>
            <p className="text-gray-500 text-sm mb-8">
              Create your account to get started
            </p>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  USERNAME
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  name="username"
                  placeholder="Seal..."
                  className="block bg-[#F0F0F0] w-full px-5 py-4 rounded-xl outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#FF4760]/20 transition-all placeholder-gray-400"
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  ID NUMBER
                </span>
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="block bg-[#F0F0F0] w-full px-5 py-4 rounded-xl outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#FF4760]/20 transition-all placeholder-gray-400"
                  name="matricule"
                  placeholder="23********"
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  PASSWORD
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="block bg-[#F0F0F0] w-full px-5 py-4 rounded-xl outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#FF4760]/20 transition-all placeholder-gray-400"
                  name="password"
                  placeholder="*******"
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  CONFIRM PASSWORD
                </span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="block bg-[#F0F0F0] w-full px-5 py-4 rounded-xl outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#FF4760]/20 transition-all placeholder-gray-400"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  disabled={loading}
                />
              </label>

              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF4760]/30 mt-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}