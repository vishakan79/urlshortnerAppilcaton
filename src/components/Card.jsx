import { motion } from "framer-motion";

const Card = ({ title, desc, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.35, delay: index * 0.07 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="bg-white shadow-md hover:shadow-xl shadow-slate-300 border border-slate-100 flex flex-col px-5 py-7 gap-3 rounded-xl transition-shadow"
  >
    <h2 className="text-slate-900 text-xl font-bold">{title}</h2>
    <p className="text-slate-700 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default Card;
