import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import illustration from "../images/happy-people-shopping-online.png";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", authData.user.id)
        .single();
      setUser(data);
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center px-6 md:px-20 lg:px-40 py-10">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 w-full">

        {/* TEXT - slides from left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5 flex-1 text-center md:text-left items-center md:items-start"
        >
          <p className="text-[#FF4760] font-semibold text-base md:text-lg">NEXUS Marketplace</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700 leading-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
              {user?.username || "User"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-md">
            Discover and exchange digital products with fellow Oran 1 students.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200 shadow-md"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate('/dashboard/sell')}
              className="px-8 py-3 rounded-full font-semibold border-2 border-[#FF4760] text-[#FF4760] hover:opacity-70 transition-opacity duration-200"
            >
              Sell a Product
            </button>
          </motion.div>
        </motion.div>

        {/* IMAGE - slides from right */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 flex justify-center"
        >
          <img
            src={illustration}
            alt="Shopping illustration"
            className="w-64 sm:w-80 md:w-full md:max-w-lg lg:max-w-xl"
          />
        </motion.div>

      </div>
    </div>
  );
}