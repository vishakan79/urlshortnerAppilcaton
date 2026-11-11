import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const features = [
  ["Simple URL Shortening", "Create short, memorable URLs in a few clicks. Paste your long link and get a share-ready short link instantly."],
  ["Powerful Analytics", "Track how many times each of your links was clicked and see which links perform best from your dashboard."],
  ["Enhanced Security", "Accounts are protected with JWT authentication and encrypted passwords so only you can manage your links."],
  ["Fast and Reliable", "Quick redirects and a lightweight backend keep your short links responsive whenever someone opens them."],
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();

  const goDashboard = () => navigate(token ? "/dashboard" : "/login");
  const goCreate = () => navigate(token ? "/dashboard" : "/register");

  return (
    <div className="min-h-[calc(100vh-64px)] lg:px-14 sm:px-8 px-4 overflow-hidden">
      <div className="lg:flex-row flex-col lg:py-8 pt-10 lg:gap-10 gap-8 flex justify-between items-center">
        <div className="flex-1">
          <motion.h1
            {...fade(0)}
            className="font-bold text-slate-800 md:text-5xl sm:text-4xl text-3xl md:leading-[58px] sm:leading-[46px] leading-10"
          >
            Linklytics Simplifies{" "}
            <span className="bg-clip-text text-transparent animated-gradient">URL Shortening</span>{" "}
            For Efficient Sharing.
          </motion.h1>
          <motion.p {...fade(0.1)} className="text-slate-700 text-sm sm:text-base my-5 max-w-xl">
            Generate concise, easy-to-share links in seconds and track every click.
            Simplify your sharing experience with Linklytics today.
          </motion.p>
          <motion.div {...fade(0.2)} className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={goDashboard}
              className="bg-custom-gradient w-44 text-white rounded-md py-2.5 shadow-lg shadow-indigo-300"
            >
              Manage Links
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={goCreate}
              className="border border-btnColor w-44 text-btnColor rounded-md py-2.5 hover:bg-indigo-50 transition-colors"
            >
              Create Short Link
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex justify-center w-full"
        >
          <img
            className="animate-float w-full max-w-[440px] object-cover rounded-md"
            src="/images/img2.png"
            alt="Link shortening illustration"
            loading="eager"
          />
        </motion.div>
      </div>

      <div className="sm:pt-12 pt-7">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-slate-800 font-bold lg:w-[60%] md:w-[70%] sm:w-[80%] mx-auto sm:text-3xl text-2xl text-center"
        >
          Trusted by individuals and teams at the world best companies
        </motion.p>
        <div className="pt-4 pb-10 grid lg:gap-7 gap-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-4">
          {features.map(([title, desc], i) => (
            <Card key={title} title={title} desc={desc} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
