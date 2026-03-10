import { motion } from 'framer-motion';

export default function Button({ children, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-white bg-linear-to-r from-[#FF4760] to-[#FF4385] py-2 px-5 rounded-full hover:opacity-90 transition-opacity duration-200"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
