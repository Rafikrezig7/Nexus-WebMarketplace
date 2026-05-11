import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import illustration from '../images/happy-people-shopping-online.png';
import {
  FiShoppingBag,
  FiTrendingUp,
  FiStar,
  FiBookOpen,
  FiDollarSign,
  FiChevronDown,
} from 'react-icons/fi';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authData.user.id)
        .single();
      setUser(data);
    }
    fetchUser();
  }, []);

  const features = [
    {
      icon: <FiBookOpen size={28} />,
      title: 'Browse & Discover',
      desc: 'Explore a wide range of academic digital products – ebooks, templates, notes and more.',
      action: 'Browse Products',
      link: '/dashboard/browse',
    },
    {
      icon: <FiDollarSign size={28} />,
      title: 'Sell Your Work',
      desc: 'Upload your own digital content, set a price, and earn money from your knowledge.',
      action: 'Sell a Product',
      link: '/dashboard/sell',
    },
    {
      icon: <FiStar size={28} />,
      title: 'Rate & Review',
      desc: 'Leave feedback on purchased products to help the community choose the best resources.',
      action: 'View Purchases',
      link: '/dashboard/mypurchases',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#EBEBEB] overflow-x-hidden">
      {/* ============= HERO SECTION ============= */}
      <div className="relative min-h-[calc(100vh-80px)] flex items-center px-4 md:px-16 lg:px-32 py-20">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#FF4760]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-gradient-to-tr from-[#FF4385]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-gray-500 shadow-sm">
              <FiShoppingBag className="text-[#FF4760]" />
              NEXUS Marketplace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                {user?.username || 'User'}
              </span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg max-w-lg leading-relaxed">
              Your academic marketplace to discover, buy, and sell digital
              products.
              <br />
              Everything you need for your studies.
            </p>

            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard/browse')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all"
              >
                <FiTrendingUp />
                Browse Products
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard/sell')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border-2 border-[#FF4760] text-[#FF4760] hover:bg-[#FFF0F1] hover:border-[#FF4385] hover:text-[#FF4385] transition-all"
              >
                <FiShoppingBag />
                Sell a Product
              </motion.button>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={illustration}
                alt="Shopping illustration"
                className="w-56 sm:w-72 md:w-full md:max-w-md lg:max-w-lg drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => {
            document.getElementById('features-section')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
        >
          <FiChevronDown size={36} className="text-[#FF4760] drop-shadow-lg" />
        </motion.div>
      </div>

      {/* ============= FEATURES SECTION ============= */}
      <div
        id="features-section"
        className="relative bg-white/50 backdrop-blur-sm py-24 px-4 md:px-16 lg:px-32"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            How NEXUS works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 mt-4 max-w-2xl mx-auto"
          >
            Make the most of your student marketplace with these core features.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
                className="group bg-white rounded-2xl px-8 py-22 shadow-md border border-gray-100 flex flex-col items-center text-center transition-all duration-300 cursor-pointer"
                onClick={() => navigate(feature.link)}
              >
                <div className="text-[#FF4760] bg-[#FFF0F1] p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {feature.desc}
                </p>
                <span className="text-[#FF4760] font-semibold text-sm group-hover:text-[#FF4385] transition-colors flex items-center gap-1">
                  {feature.action}{' '}
                  <FiChevronDown className="transform -rotate-90" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ============= FOOTER / SPACER ============= */}
      <footer className="py-16 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} NEXUS Marketplace – University of Oran 1.
        All rights reserved.
      </footer>
    </div>
  );
}
