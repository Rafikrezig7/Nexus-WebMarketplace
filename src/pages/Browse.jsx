import { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './DashboardLayout';
import { IoFilterOutline } from 'react-icons/io5';

export default function Browse() {
  const Navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedFiliere, setSelectedFiliere] = useState('All');

  const subjects = ['All', ...new Set(products.map(p => p.subject))];
  const levels = ['All', ...new Set(products.map(p => p.level))];
  const filieres = ['All', ...new Set(products.map(p => p.filiere))];

  const { searchQuery, showFilter } = useContext(SearchContext);
  const filteredProducts = products
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => selectedSubject === 'All' || p.subject === selectedSubject)
    .filter(p => selectedLevel === 'All' || p.level === selectedLevel)
    .filter(p => selectedFiliere === 'All' || p.filiere === selectedFiliere);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*');
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (products.length === 0)
    return <div className="p-10 text-gray-400"> No products found </div>;
  return (
    <div>
      {showFilter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex gap-4 px-4 sm:px-20 py-3 bg-white shadow-sm flex-wrap justify-center"
        >
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-[#F0F0F0] rounded-full px-4 py-2 outline-none text-sm text-gray-500 "
          >
            {subjects.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="bg-[#F0F0F0] rounded-full px-4 py-2 outline-none text-sm text-gray-500"
          >
            {levels.map(l => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={selectedFiliere}
            onChange={e => setSelectedFiliere(e.target.value)}
            className="bg-[#F0F0F0] rounded-full px-4 py-2 outline-none text-sm text-gray-500"
          >
            {filieres.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-40 py-5">
        {filteredProducts.map((product, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            key={product.id}
            onClick={() => Navigate(`/dashboard/product/${product.id}`)}
            className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden cursor-pointer"
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
          >
            <div className="relative h-56 w-full bg-gray-50 overflow-hidden flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow gap-3">
              <h2 className="font-semibold text-gray-800 text-base line-clamp-2 leading-tight">
                {product.title}
              </h2>

              <div className="flex flex-wrap gap-1.5">
                <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {product.subject}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {product.level}
                </span>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <p className="font-bold text-base bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                  {product.price} DA
                </p>

                <button className="text-sm px-4 py-1.5 bg-gradient-to-r from-[#FF4760] to-[#FF4385] text-white rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200">
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
