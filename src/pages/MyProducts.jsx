import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IoPencilOutline, IoRemoveOutline } from 'react-icons/io5';

function MyProducts() {
  const [myproduct, setMyProduct] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user.id);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchPurchases() {
      setLoading(false);
      const { data } = await supabase
        .from('products')
        .select('*, purchases(count)')
        .eq('seller_id', user);
      setMyProduct(data);
    }
    fetchPurchases();
  }, [user]);

  async function handleDelete(productId) {
    try {
      const { error: purchasesError } = await supabase
        .from('purchases')
        .delete()
        .eq('product_id', productId);
      if (purchasesError) {
        alert(purchasesError.message);
        return;
      }
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) {
        alert(error.message);
      }
      setMyProduct(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleEdit() {
    const { error } = await supabase
      .from('products')
      .update({
        title: editProduct.title,
        subject: editProduct.subject,
        level: editProduct.level,
        filiere: editProduct.filiere,
        price: editProduct.price,
      })
      .eq('id', editProduct.id);
    if (error) {
      alert(error.message);
      return;
    }
    setMyProduct(prev =>
      prev.map(p => (p.id === editProduct.id ? editProduct : p))
    );
    setEditProduct(null);
    alert('product updated');
  }

  if (loading) return <div className="p-10 text-gray-400">Loading...</div>;
  if (myproduct.length === 0)
    return (
      <div className="p-10 text-gray-400">No Products Uploaded yet ...</div>
    );

  // ↪ Écran d'édition (inchangé)
  if (editProduct) {
    return (
      <div className="flex justify-center items-center my-10 px-4">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl p-10 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-700">Edit Product</h1>
          <label className="text-xs font-bold text-gray-500 tracking-widest">
            TITLE
            <input
              value={editProduct.title}
              onChange={e =>
                setEditProduct({ ...editProduct, title: e.target.value })
              }
              className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-500"
            />
          </label>
          <label className="text-xs font-bold text-gray-500 tracking-widest">
            SUBJECT
            <input
              value={editProduct.subject}
              onChange={e =>
                setEditProduct({ ...editProduct, subject: e.target.value })
              }
              className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-500"
            />
          </label>
          <label className="text-xs font-bold text-gray-500 tracking-widest">
            LEVEL
            <input
              value={editProduct.level}
              onChange={e =>
                setEditProduct({ ...editProduct, level: e.target.value })
              }
              className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-500"
            />
          </label>
          <label className="text-xs font-bold text-gray-500 tracking-widest">
            FILIERE
            <input
              value={editProduct.filiere}
              onChange={e =>
                setEditProduct({ ...editProduct, filiere: e.target.value })
              }
              className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-500"
            />
          </label>
          <label className="text-xs font-bold text-gray-500 tracking-widest">
            PRICE
            <input
              value={editProduct.price}
              onChange={e =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              className="block bg-[#F0F0F0] w-full p-3 mt-2 rounded-full outline-none text-sm text-gray-500"
            />
          </label>
          <button
            onClick={handleEdit}
            className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385]"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditProduct(null)}
            className="text-gray-400 text-sm text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ✅ Liste des produits – style aligné sur Browse
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-40 py-8">
      {myproduct.map((product, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden relative"
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
          key={product.id}
        >
          {/* Image */}
          <div className="relative h-56 w-full bg-gray-50 overflow-hidden flex-shrink-0">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Contenu */}
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

            {/* Prix + bouton Edit */}
            <div className="flex items-center justify-between mt-2">
              <p className="font-bold text-base bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                {product.price} DA
              </p>
              <button
                onClick={() => setEditProduct(product)}
                className="flex items-center gap-1 bg-[#fff0f1] font-bold text-[#FF4760] rounded-full p-1 px-2 hover:bg-gradient-to-r hover:from-[#FF4760] hover:to-[#FF4385] hover:text-white transition-colors duration-200"
              >
                <IoPencilOutline size={13} /> Edit
              </button>
            </div>

            {/* Ventes & Revenu */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                    {product.purchases[0]?.count}
                  </span>{' '}
                  sales
                </p>
                <p className="text-xs text-gray-400">
                  <span className="font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                    {product.purchases[0]?.count * product.price} DA
                  </span>{' '}
                  revenue
                </p>
              </div>
            </div>
          </div>

          {/* Bouton Delete (flottant) */}
          <button
            onClick={() => handleDelete(product.id)}
            className="absolute top-2 right-2 bg-[#fff0f1] text-[#FF4760] rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            <IoRemoveOutline size={16} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default MyProducts;
