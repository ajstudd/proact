"use client";

import { motion } from "framer-motion";
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaUser } from "react-icons/fa";
import { getUserData } from "@utils";

export default function Profile() {
  const user = getUserData();

  // Extract user details
  const profileInfo = {
    name: user?.name || "Unknown User",
    email: user?.email || "No Email Provided",
    isVerified: user?.isVerified || false,
    profile: user?.profile || "https://www.w3schools.com/howto/img_avatar.png", // Default avatar
  };

  return (
    <motion.div
      className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Card */}
      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500 shadow-md"
          src={profileInfo.profile}
          alt="Profile"
        />
        <h2 className="text-2xl font-bold mt-4">{profileInfo.name}</h2>
        <p className="text-gray-400">{profileInfo.email}</p>

        {/* User Role & Verification Status */}
        <div className="mt-4 flex justify-center gap-4 text-gray-300">
          {/* <div className="flex items-center gap-2">
            <FaUserShield className="text-blue-400 text-xl" />
            <p className="text-sm font-semibold">{profileInfo.role}</p>
          </div> */}
          <div className="flex items-center gap-2">
            {profileInfo.isVerified ? (
              <>
                <FaCheckCircle className="text-green-400 text-xl" />
                <p className="text-sm font-semibold">Verified</p>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-400 text-xl" />
                <p className="text-sm font-semibold">Not Verified</p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <motion.div
        className="mt-8 w-full max-w-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Navigation Tabs */}
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <FaUser /> My Posts
          </button>
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <FaUser /> Contributions
          </button>
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <FaUser /> Bookmarked Projects
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="mt-6 text-gray-400 text-center">
          <p>Coming soon...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
