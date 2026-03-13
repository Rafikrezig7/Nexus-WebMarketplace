import { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './DashboardLayout';

export default function Browse() {
  const Navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  const searchQuery = useContext(SearchContext);

  const filteredProducts = products
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => selectedSubject === 'All' || p.subject === selectedSubject);
  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from('products').select('*');
      setProducts(data);
    }
    getProducts();
  }, []);

  const subjects = ['All', ...new Set(products.map(p => p.subject))];

  if (products.length === 0)
    return <div className="p-10 text-gray-400"> No products found </div>;
  return (
    <div>
      <select
        value={selectedSubject}
        onChange={e => setSelectedSubject(e.target.value)}
        className="bg-[#F0F0F0] rounded-full ml-4 sm:ml-20 mt-5 px-4 py-2 outline-none text-sm text-gray-500"
      >
        {subjects.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-20 py-5">
        {filteredProducts.map((product, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md"
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            key={product.id}
            onClick={() => Navigate(`/dashboard/product/${product.id}`)}
          >
            <div className="bg-gray-50 rounded-md flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.title}
                className="h-64 w-full rounded-md object-contain"
              />
            </div>
            <h2 className="font-semibold text-gray-700 text-sm">
              {product.title}
            </h2>
            <div className="flex gap-1">
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                {product.subject}
              </span>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                {product.level}
              </span>
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="whitespace-nowrap mr-2 font-bold text-sm bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                {product.price} DA
              </p>
              <button className="overflow-hidden whitespace-nowrap w-full sm:w-auto text-sm px-2 bg-gradient-to-r from-[#FF4760] to-[#FF4385] text-white py-1 rounded-full hover:opacity-90 transition-opacity duration-200 shadow-md cursor-pointer">
                Add To Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
