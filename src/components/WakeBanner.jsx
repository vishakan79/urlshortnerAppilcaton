import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getWaking, subscribeWaking } from "../api";

const WakeBanner = () => {
  const waking = useSyncExternalStore(subscribeWaking, getWaking);
  return (
    <AnimatePresence>
      {waking && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] w-[92%] max-w-md bg-slate-900 text-white rounded-lg shadow-xl px-4 py-3 flex items-center gap-3"
          role="status"
        >
          <span className="w-5 h-5 shrink-0 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-sm">
            <b>Waking up the server...</b> Free hosting sleeps when idle, this can take up to a minute.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WakeBanner;
