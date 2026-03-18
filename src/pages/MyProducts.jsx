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
        .select('*')
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

  if (loading) return <div>Loading...</div>;

  if (myproduct.length === 0) {
    return <div>No Products Uploaded yet ...</div>;
  }

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

  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-40 py-8">
      {myproduct.map((product, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative flex flex-col gap-2 bg-white p-4 rounded-md shadow-md"
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
          key={product.id}
        >
          <div className="bg-gray-50 mt-5 rounded-md flex items-center justify-center">
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
          <div className="flex px-1 items-center justify-between ">
            <div className="flex items-center justify-between px-1">
              <p className="whitespace-nowrap mr-2 font-bold text-sm bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
                {product.price} DA
              </p>
            </div>
            <button
              onClick={() => {
                setEditProduct(product);
              }}
              className="flex items-center gap-1 bg-[#fff0f1] font-bold text-[#FF4760] rounded-full p-1 px-2 hover:bg-gradient-to-r hover:from-[#FF4760] hover:to-[#FF4385] hover:text-white transition-colors duration-200"
            >
              <IoPencilOutline size={13} /> Edit
            </button>
          </div>
          <button
            onClick={() => {
              handleDelete(product.id);
            }}
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
