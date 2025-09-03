import { useState, useEffect } from "react";
import {
  notificationService,
  NotificationData,
} from "../services/notificationService";

export const useNotifications = (recipientType?: "admin" | "client") => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Charger les notifications initiales
    const loadNotifications = () => {
      const allNotifications = recipientType
        ? notificationService.getNotificationsForRecipient(recipientType)
        : notificationService.getNotifications();

      const unreadNotifications = recipientType
        ? notificationService.getUnreadNotifications(recipientType)
        : notificationService.getUnreadNotifications();

      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
      setLoading(false);
    };

    loadNotifications();

    // S'abonner aux changements avec protection
    const unsubscribe = notificationService.subscribe(
      (updatedNotifications) => {
        // Vérifier si le composant est toujours monté
        if (!mounted) return;

        try {
          const filteredNotifications = recipientType
            ? updatedNotifications.filter(
                (notif) =>
                  notif.recipientType === recipientType ||
                  notif.recipientType === "all",
              )
            : updatedNotifications;

          const unreadNotifications = filteredNotifications.filter(
            (notif) => !notif.read,
          );

          // Utiliser un micro-task pour éviter les mises à jour synchrones
          Promise.resolve().then(() => {
            if (mounted) {
              setNotifications(filteredNotifications);
              setUnreadCount(unreadNotifications.length);
            }
          });
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour des notifications:",
            error,
          );
        }
      },
    );

    // Nettoyage au démontage
    return () => {
      setMounted(false);
      unsubscribe();
    };
  }, [recipientType, mounted]);

  // Gestion du démontage
  useEffect(() => {
    return () => {
      setMounted(false);
    };
  }, []);

  const markAsRead = (id: string) => {
    return notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    return notificationService.markAllAsRead(recipientType);
  };

  const deleteNotification = (id: string) => {
    return notificationService.deleteNotification(id);
  };

  const clearAll = () => {
    return notificationService.clearAllNotifications(recipientType);
  };

  const addNotification = (
    notification: Omit<NotificationData, "id" | "timestamp" | "read">,
  ) => {
    return notificationService.addNotification(notification);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
  };
};

export default useNotifications;
