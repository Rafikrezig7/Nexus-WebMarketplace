import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EBEBEB] relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#FF4760]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-[#FF4385]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-gray-500 shadow-sm mb-6">
            <FiBookOpen className="text-[#FF4760]" />
            University of Oran 1 – Student Marketplace
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-bold text-5xl sm:text-6xl text-gray-800 leading-tight"
        >
          Welcome to NEX
          <span className="bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
            US
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-gray-500 text-lg max-w-xl leading-relaxed"
        >
          The digital product exchange platform for students.
          <br />
          Buy, sell, and boost your academic journey with ease.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/signin')}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign In
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3.5 rounded-full font-semibold border-2 border-[#FF4760] text-[#FF4760] hover:bg-[#FFF0F1] hover:border-[#FF4385] hover:text-[#FF4385] transition-all duration-300"
          >
            Sign Up
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-xs text-gray-400"
        >
          Secure login with your university student ID
        </motion.p>
      </div>
    </div>
  );
}
