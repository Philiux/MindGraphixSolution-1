import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Shield, User, Crown } from "lucide-react";

export const BotPositionManager: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();

  const getStatusIcon = () => {
    if (isSuperAdmin) return <Crown size={14} className="text-yellow-400" />;
    if (isAdmin) return <Shield size={14} className="text-blue-400" />;
    return <User size={14} className="text-green-400" />;
  };

  const getStatusColor = () => {
    if (isSuperAdmin)
      return "from-yellow-500/20 to-purple-500/20 border-yellow-400/30";
    if (isAdmin) return "from-blue-500/20 to-cyan-500/20 border-blue-400/30";
    return "from-green-500/20 to-emerald-500/20 border-green-400/30";
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
    >
      <motion.div
        className={`bg-gradient-to-br ${getStatusColor()} backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl border shadow-lg`}
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div className="flex flex-col">
            <span className="font-semibold">
              {isSuperAdmin
                ? "Super Admin"
                : isAdmin
                  ? "Administrateur"
                  : "Visiteur"}
            </span>
            <span className="opacity-75 text-xs">
              {isAdmin
                ? `${isSuperAdmin ? "3" : "2"} bots actifs`
                : "1 bot actif"}
            </span>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BotPositionManager;
