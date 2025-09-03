import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Palette, Sparkles, Zap } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  duration?: number;
  icon?: React.ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType | null>(
  null,
);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 4000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: () => void;
}> = ({ notification, onRemove }) => {
  const getIcon = () => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "info":
        return <Palette className="w-5 h-5 text-blue-400" />;
      case "warning":
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "from-green-500/20 to-green-600/20 border-green-500/30";
      case "info":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
      case "warning":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      default:
        return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`p-4 rounded-xl backdrop-blur-lg border shadow-lg bg-gradient-to-r ${getBgColor()}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm mb-1">
            {notification.title}
          </h4>
          <p className="text-white/80 text-xs leading-relaxed">
            {notification.message}
          </p>
        </div>

        <motion.button
          onClick={onRemove}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 text-white/60" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Hook utilitaire pour les notifications de design
export const useDesignNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyColorChange = (paletteName: string) => {
    addNotification({
      type: "success",
      title: "Palette Appliquée",
      message: `La palette "${paletteName}" a été appliquée avec succès !`,
      icon: <Palette className="w-5 h-5 text-green-400" />,
      duration: 3000,
    });
  };

  const notifyFeatureActivated = (featureName: string) => {
    addNotification({
      type: "info",
      title: "Fonctionnalité Activée",
      message: `${featureName} est maintenant activé.`,
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      duration: 2500,
    });
  };

  const notifyFeatureDeactivated = (featureName: string) => {
    addNotification({
      type: "warning",
      title: "Fonctionnalité Désactivée",
      message: `${featureName} a été désactivé.`,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      duration: 2500,
    });
  };

  return {
    notifyColorChange,
    notifyFeatureActivated,
    notifyFeatureDeactivated,
  };
};
