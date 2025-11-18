import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-700 flex flex-col justify-center items-center text-white p-6">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-9xl font-extrabold"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl mt-4 mb-8 text-center max-w-md opacity-90"
      >
        Oops! The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-amber-400 text-gray-900 font-bold shadow-lg hover:shadow-xl transition"
        >
          Go Back Home
        </motion.button>
      </Link>
    </div>
  );
}
