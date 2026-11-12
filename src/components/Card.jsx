import { motion } from "framer-motion";

const Card = ({ title, desc, icon, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.35, delay: index * 0.07 }}
    whileHover={{ y: -6 }}
    className="group bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 rounded-2xl p-6 transition-all"
  >
    <div className="w-12 h-12 rounded-xl bg-custom-gradient text-white flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-slate-900 text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default Card;
