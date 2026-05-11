import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function MyPurchases() {
  const [user, setUser] = useState(null);
  const [myPurchases, setMyPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user.id);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchPurchases() {
      setLoading(false);
      const { data } = await supabase
        .from('purchases')
        .select('*,products(*)')
        .eq('buyer_id', user);
      setMyPurchases(data || []);
    }
    fetchPurchases();
  }, [user]);

  if (loading) return <div className="p-10 text-gray-400">Loading...</div>;
  if (myPurchases.length === 0)
    return <div className="p-10 text-gray-400">No Purchases Found</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-40 py-8">
      {myPurchases.map((purchase, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden"
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
          key={purchase.products.id}
        >
          {/* Image */}
          <div className="relative h-56 w-full bg-gray-50 overflow-hidden flex-shrink-0">
            <img
              src={purchase.products.image_url}
              alt={purchase.products.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Contenu */}
          <div className="p-4 flex flex-col flex-grow gap-3">
            <h2 className="font-semibold text-gray-800 text-base line-clamp-2 leading-tight">
              {purchase.products.title}
            </h2>

            <div className="flex flex-wrap gap-1.5">
              <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                {purchase.products.subject}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                {purchase.products.level}
              </span>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
              <p className="font-bold text-base bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                {purchase.products.price} DA
              </p>
              {/* Aucun bouton ajouté, comme demandé */}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
