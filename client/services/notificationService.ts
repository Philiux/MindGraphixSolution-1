interface NotificationData {
  id: string;
  timestamp: Date;
  type:
    | "quote_request"
    | "quote_sent"
    | "quote_accepted"
    | "quote_rejected"
    | "contact_form"
    | "system";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  recipientType: "admin" | "client" | "all";
  priority: "low" | "medium" | "high";
}

class NotificationService {
  private readonly STORAGE_KEY = "notifications";
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  // Ajouter une notification
  addNotification(
    notification: Omit<NotificationData, "id" | "timestamp" | "read">,
  ): string {
    const newNotification: NotificationData = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    const notifications = this.getNotifications();
    notifications.unshift(newNotification); // Ajouter au début

    // Garder seulement les 100 dernières notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    this.saveNotifications(notifications);
    this.notifyListeners(notifications);

    return newNotification.id;
  }

  // Récupérer toutes les notifications
  getNotifications(): NotificationData[] {
    try {
      const notifications = localStorage.getItem(this.STORAGE_KEY);
      if (!notifications) return [];

      return JSON.parse(notifications).map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }

  // Récupérer les notifications pour un type de destinataire
  getNotificationsForRecipient(
    recipientType: "admin" | "client",
  ): NotificationData[] {
    const notifications = this.getNotifications();
    return notifications.filter(
      (notif) =>
        notif.recipientType === recipientType || notif.recipientType === "all",
    );
  }

  // Récupérer les notifications non lues
  getUnreadNotifications(
    recipientType?: "admin" | "client",
  ): NotificationData[] {
    const notifications = recipientType
      ? this.getNotificationsForRecipient(recipientType)
      : this.getNotifications();

    return notifications.filter((notif) => !notif.read);
  }

  // Marquer une notification comme lue
  markAsRead(id: string): boolean {
    const notifications = this.getNotifications();
    const notificationIndex = notifications.findIndex(
      (notif) => notif.id === id,
    );

    if (notificationIndex === -1) return false;

    notifications[notificationIndex].read = true;
    this.saveNotifications(notifications);
    this.notifyListeners(notifications);

    return true;
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(recipientType?: "admin" | "client"): boolean {
    const notifications = this.getNotifications();
    let updated = false;

    notifications.forEach((notif) => {
      if (
        !notif.read &&
        (!recipientType ||
          notif.recipientType === recipientType ||
          notif.recipientType === "all")
      ) {
        notif.read = true;
        updated = true;
      }
    });

    if (updated) {
      this.saveNotifications(notifications);
      this.notifyListeners(notifications);
    }

    return updated;
  }

  // Supprimer une notification
  deleteNotification(id: string): boolean {
    const notifications = this.getNotifications();
    const filteredNotifications = notifications.filter(
      (notif) => notif.id !== id,
    );

    if (filteredNotifications.length !== notifications.length) {
      this.saveNotifications(filteredNotifications);
      this.notifyListeners(filteredNotifications);
      return true;
    }

    return false;
  }

  // Supprimer toutes les notifications
  clearAllNotifications(recipientType?: "admin" | "client"): boolean {
    if (recipientType) {
      const notifications = this.getNotifications();
      const filteredNotifications = notifications.filter(
        (notif) =>
          notif.recipientType !== recipientType &&
          notif.recipientType !== "all",
      );
      this.saveNotifications(filteredNotifications);
      this.notifyListeners(filteredNotifications);
    } else {
      this.saveNotifications([]);
      this.notifyListeners([]);
    }

    return true;
  }

  // Écouter les changements de notifications
  subscribe(listener: (notifications: NotificationData[]) => void): () => void {
    this.listeners.push(listener);

    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Sauvegarder les notifications
  private saveNotifications(notifications: NotificationData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notifications:", error);
    }
  }

  // Notifier les listeners
  private notifyListeners(notifications: NotificationData[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(notifications);
      } catch (error) {
        console.error("Erreur dans un listener de notification:", error);
      }
    });
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Méthodes utilitaires pour créer des notifications spécifiques

  // Notification de nouvelle demande de devis
  notifyNewQuoteRequest(clientData: any, projectData: any): string {
    return this.addNotification({
      type: "quote_request",
      title: "Nouvelle demande de devis",
      message: `${clientData.firstName} ${clientData.lastName} a fait une demande de devis pour "${projectData.title}"`,
      data: { clientData, projectData },
      recipientType: "admin",
      priority: "high",
    });
  }

  // Notification d'envoi de devis
  notifyQuoteSent(clientEmail: string, projectTitle: string): string {
    return this.addNotification({
      type: "quote_sent",
      title: "Devis envoyé",
      message: `Un devis a été envoyé pour le projet "${projectTitle}"`,
      data: { clientEmail, projectTitle },
      recipientType: "client",
      priority: "medium",
    });
  }

  // Notification d'acceptation de devis
  notifyQuoteAccepted(
    clientEmail: string,
    projectTitle: string,
    amount: number,
  ): string {
    return this.addNotification({
      type: "quote_accepted",
      title: "Devis accepté",
      message: `Le devis pour "${projectTitle}" a été accepté (${amount.toLocaleString()} FCFA)`,
      data: { clientEmail, projectTitle, amount },
      recipientType: "admin",
      priority: "high",
    });
  }

  // Notification de rejet de devis
  notifyQuoteRejected(clientEmail: string, projectTitle: string): string {
    return this.addNotification({
      type: "quote_rejected",
      title: "Devis rejeté",
      message: `Le devis pour "${projectTitle}" a été rejeté`,
      data: { clientEmail, projectTitle },
      recipientType: "admin",
      priority: "medium",
    });
  }

  // Notification de formulaire de contact
  notifyContactForm(formData: any): string {
    return this.addNotification({
      type: "contact_form",
      title: "Nouveau message de contact",
      message: `${formData.subject || "Message de contact"} de ${formData.email}`,
      data: formData,
      recipientType: "admin",
      priority: "medium",
    });
  }

  // Notification système
  notifySystem(
    title: string,
    message: string,
    priority: "low" | "medium" | "high" = "low",
  ): string {
    return this.addNotification({
      type: "system",
      title,
      message,
      recipientType: "all",
      priority,
    });
  }

  // Obtenir les statistiques des notifications
  getNotificationStats() {
    const notifications = this.getNotifications();
    const adminNotifications = this.getNotificationsForRecipient("admin");
    const clientNotifications = this.getNotificationsForRecipient("client");

    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      admin: {
        total: adminNotifications.length,
        unread: adminNotifications.filter((n) => !n.read).length,
      },
      client: {
        total: clientNotifications.length,
        unread: clientNotifications.filter((n) => !n.read).length,
      },
      byType: {
        quote_request: notifications.filter((n) => n.type === "quote_request")
          .length,
        quote_sent: notifications.filter((n) => n.type === "quote_sent").length,
        quote_accepted: notifications.filter((n) => n.type === "quote_accepted")
          .length,
        quote_rejected: notifications.filter((n) => n.type === "quote_rejected")
          .length,
        contact_form: notifications.filter((n) => n.type === "contact_form")
          .length,
        system: notifications.filter((n) => n.type === "system").length,
      },
    };
  }
}

// Instance singleton
export const notificationService = new NotificationService();
export type { NotificationData };
