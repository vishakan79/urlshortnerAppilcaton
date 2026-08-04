import React from "react";
import { motion } from "framer-motion";

const LandlingPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] lg:px-14 sm:px-8 px-4">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:gap-10 gap-8 pt-16 lg:py-5">
        
        {/* Left Section */}
        <div className="flex-1">
          <h1 className="font-bold font-roboto text-slate-800 md:text-5xl sm:text-4xl text-3xl md:leading-[55px] sm:leading-[45px] leading-10 lg:w-full md:w-[70%] w-full">
            Linklytics Simplifies URL Shortening For Efficient Sharing
          </h1>

          <p className="text-slate-700 text-sm my-5">
            Linklytics streamlines the process of URL shortening, making sharing
            links effortless and efficient. With its user-friendly interface,
            Linklytics allows you to generate concise, easy-to-share URLs in
            seconds. Simplify your sharing experience with Linklytics today.
          </p>

          <div className="flex items-center gap-3">
            <button className="bg-custom-gradient w-40 text-white rounded-md py-2">
              Manage Links
            </button>

            <button className="border border-btnColor w-40 text-btnColor rounded-md py-2">
              Create Short Link
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src="/images/img2.png"
            alt="Linklytics"
            className="sm:w-[480px] w-[400px] object-contain"
          />
        </div>
      </div>
      <div>
        <p className="text-slate-800 font-roboto font-bold lg:w-[60%]  md:w-[70%] sm:w-[80%] mx-auto text-3xl text-center">
          Trusted by individuals and teams at the world best companies{" "}
        </p>
      </div>
    </div>
  );
};

export default LandlingPage;