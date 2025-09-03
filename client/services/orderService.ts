import {
  Order,
  OrderStatus,
  Client,
  OrderMessage,
  ProjectFile,
  Milestone,
  OrderNotification,
  OrderType,
} from "../types/orders";

class OrderService {
  private readonly STORAGE_KEYS = {
    ORDERS: "unified_orders",
    CLIENTS: "unified_clients",
    NOTIFICATIONS: "unified_notifications",
  };

  // Récupération des données
  getOrders(): Order[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
    if (!data) return [];

    return JSON.parse(data).map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      dueDate: order.dueDate ? new Date(order.dueDate) : undefined,
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery)
        : undefined,
      actualDelivery: order.actualDelivery
        ? new Date(order.actualDelivery)
        : undefined,
      messages: order.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      files: order.files.map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      })),
      milestones: order.milestones.map((milestone: any) => ({
        ...milestone,
        dueDate: new Date(milestone.dueDate),
        completedAt: milestone.completedAt
          ? new Date(milestone.completedAt)
          : undefined,
      })),
    }));
  }

  getClients(): Client[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.CLIENTS);
    if (!data) return [];

    return JSON.parse(data).map((client: any) => ({
      ...client,
      registeredAt: new Date(client.registeredAt),
    }));
  }

  getNotifications(): OrderNotification[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return [];

    return JSON.parse(data).map((notif: any) => ({
      ...notif,
      timestamp: new Date(notif.timestamp),
    }));
  }

  // Sauvegarde des données
  private saveOrders(orders: Order[]): void {
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  private saveClients(clients: Client[]): void {
    localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  private saveNotifications(notifications: OrderNotification[]): void {
    localStorage.setItem(
      this.STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications),
    );
  }

  // Gestion des clients
  createOrUpdateClient(clientData: Partial<Client>): Client {
    const clients = this.getClients();
    const existingClient = clients.find((c) => c.email === clientData.email);

    if (existingClient) {
      const updatedClient = { ...existingClient, ...clientData };
      const updatedClients = clients.map((c) =>
        c.id === existingClient.id ? updatedClient : c,
      );
      this.saveClients(updatedClients);
      return updatedClient;
    }

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: clientData.name || "",
      email: clientData.email || "",
      phone: clientData.phone || "",
      company: clientData.company,
      registeredAt: new Date(),
      totalOrders: 0,
      totalValue: 0,
      ...clientData,
    };

    clients.push(newClient);
    this.saveClients(clients);
    return newClient;
  }

  // Conversion des anciennes demandes de devis
  migrateFromLegacyQuoteRequests(): void {
    const legacyQuotes = JSON.parse(
      localStorage.getItem("quoteRequests") || "[]",
    );
    const legacyNotifications = JSON.parse(
      localStorage.getItem("adminNotifications") || "[]",
    );

    if (legacyQuotes.length === 0) return;

    const orders: Order[] = [];
    const clients: Client[] = [];

    legacyQuotes.forEach((quote: any) => {
      // Créer ou récupérer le client
      let client = clients.find((c) => c.email === quote.clientEmail);
      if (!client) {
        client = this.createOrUpdateClient({
          name: quote.clientName,
          email: quote.clientEmail,
          phone: quote.clientPhone,
        });
        clients.push(client);
      }

      // Créer la commande
      const order: Order = {
        id:
          quote.id ||
          `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clientId: client.id,
        client: client,
        type: "quote" as OrderType,
        status: this.mapLegacyStatus(quote.status),
        priority: "medium",
        title: quote.projectTitle,
        category: quote.projectCategory,
        description: quote.projectDescription,
        budget: quote.budget,
        timeline: quote.timeline,
        additionalRequirements: quote.additionalRequirements,
        createdAt: quote.timestamp ? new Date(quote.timestamp) : new Date(),
        updatedAt: new Date(),
        progress: 0,
        messages: [],
        files: [],
        milestones: [],
      };

      orders.push(order);
    });

    // Sauvegarder les nouvelles données
    this.saveOrders(orders);

    // Nettoyer les anciennes données
    localStorage.removeItem("quoteRequests");

    console.log(
      `Migré ${orders.length} demandes de devis vers le nouveau système`,
    );
  }

  private mapLegacyStatus(legacyStatus: string): OrderStatus {
    switch (legacyStatus) {
      case "new":
        return "quote_requested";
      case "reviewing":
        return "quote_reviewing";
      case "quoted":
        return "quote_sent";
      case "accepted":
        return "quote_accepted";
      case "rejected":
        return "quote_rejected";
      case "archived":
        return "archived";
      default:
        return "quote_requested";
    }
  }

  // Gestion des commandes
  createOrder(orderData: Partial<Order>): Order {
    const orders = this.getOrders();

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientId: orderData.clientId || "",
      client: orderData.client!,
      type: orderData.type || "quote",
      status: "quote_requested",
      priority: "medium",
      title: orderData.title || "",
      category: orderData.category || "",
      description: orderData.description || "",
      budget: orderData.budget || "",
      timeline: orderData.timeline || "",
      additionalRequirements: orderData.additionalRequirements,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      messages: [],
      files: [],
      milestones: [],
      ...orderData,
    };

    orders.push(newOrder);
    this.saveOrders(orders);

    // Créer notification
    this.createNotification({
      orderId: newOrder.id,
      recipientType: "admin",
      type: "status_change",
      title: "Nouvelle demande de devis",
      message: `${newOrder.client.name} a demandé un devis pour "${newOrder.title}"`,
      urgent: false,
    });

    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    const oldStatus = order.status;

    orders[orderIndex] = {
      ...order,
      status: newStatus,
      updatedAt: new Date(),
      progress: this.calculateProgress(newStatus),
    };

    this.saveOrders(orders);

    // Créer notification pour le changement de statut
    this.createNotification({
      orderId: orderId,
      recipientType: "client",
      type: "status_change",
      title: "Mise à jour de votre projet",
      message: this.getStatusChangeMessage(oldStatus, newStatus),
      urgent: ["quote_sent", "project_completed", "project_delivered"].includes(
        newStatus,
      ),
    });

    // Événement pour mise à jour en temps réel
    window.dispatchEvent(
      new CustomEvent("orderStatusChanged", {
        detail: { orderId, oldStatus, newStatus, order: orders[orderIndex] },
      }),
    );
  }

  private calculateProgress(status: OrderStatus): number {
    const progressMap: Record<OrderStatus, number> = {
      quote_requested: 5,
      quote_reviewing: 15,
      quote_sent: 25,
      quote_accepted: 35,
      quote_rejected: 0,
      project_started: 45,
      project_in_progress: 70,
      project_review: 85,
      project_completed: 95,
      project_delivered: 100,
      archived: 100,
    };

    return progressMap[status] || 0;
  }

  private getStatusChangeMessage(
    oldStatus: OrderStatus,
    newStatus: OrderStatus,
  ): string {
    const messages: Record<OrderStatus, string> = {
      quote_requested: "Votre demande de devis a été reçue",
      quote_reviewing: "Votre demande est en cours d'examen",
      quote_sent: "Votre devis est prêt! Consultez votre espace client",
      quote_accepted: "Votre devis a été accepté, le projet va commencer",
      quote_rejected: "Votre devis a été refusé",
      project_started: "Votre projet a officiellement commencé!",
      project_in_progress: "Votre projet avance bien",
      project_review: "Votre projet est en phase de révision",
      project_completed: "Votre projet est terminé!",
      project_delivered: "Votre projet a été livré avec succès",
      archived: "Votre projet a été archivé",
    };

    return messages[newStatus] || "Statut du projet mis à jour";
  }

  // Gestion des messages
  addMessage(
    orderId: string,
    message: Omit<OrderMessage, "id" | "orderId" | "timestamp">,
  ): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) return;

    const newMessage: OrderMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderId: orderId,
      timestamp: new Date(),
      read: false,
      ...message,
    };

    orders[orderIndex].messages.push(newMessage);
    orders[orderIndex].updatedAt = new Date();
    this.saveOrders(orders);

    // Créer notification
    this.createNotification({
      orderId: orderId,
      recipientType: message.senderType === "client" ? "admin" : "client",
      type: "new_message",
      title: "Nouveau message",
      message: `${message.senderType === "client" ? "Le client" : "L'équipe"} vous a envoyé un message`,
      urgent: false,
    });
  }

  // Gestion des fichiers
  addFile(
    orderId: string,
    file: Omit<ProjectFile, "id" | "orderId" | "uploadedAt">,
  ): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) return;

    const newFile: ProjectFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderId: orderId,
      uploadedAt: new Date(),
      ...file,
    };

    orders[orderIndex].files.push(newFile);
    orders[orderIndex].updatedAt = new Date();
    this.saveOrders(orders);

    // Créer notification
    this.createNotification({
      orderId: orderId,
      recipientType: file.uploadedBy === "client" ? "admin" : "client",
      type: "new_file",
      title: "Nouveau fichier",
      message: `Un nouveau fichier "${file.name}" a été ajouté`,
      urgent: false,
    });
  }

  // Gestion des notifications
  createNotification(
    notificationData: Omit<OrderNotification, "id" | "timestamp" | "read">,
  ): void {
    const notifications = this.getNotifications();

    const newNotification: OrderNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      ...notificationData,
    };

    notifications.unshift(newNotification);

    // Garder seulement les 100 dernières notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    this.saveNotifications(notifications);

    // Événement pour mise à jour en temps réel
    window.dispatchEvent(
      new CustomEvent("newOrderNotification", {
        detail: newNotification,
      }),
    );
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId,
    );

    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true;
      this.saveNotifications(notifications);
    }
  }

  // Utilitaires
  getOrdersByClientId(clientId: string): Order[] {
    return this.getOrders().filter((order) => order.clientId === clientId);
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getOrders().filter((order) => order.status === status);
  }

  getOrderStats() {
    const orders = this.getOrders();
    const clients = this.getClients();

    return {
      totalOrders: orders.length,
      totalClients: clients.length,
      pendingQuotes: orders.filter((o) => o.status === "quote_requested")
        .length,
      activeProjects: orders.filter((o) =>
        ["project_started", "project_in_progress", "project_review"].includes(
          o.status,
        ),
      ).length,
      completedProjects: orders.filter((o) =>
        ["project_completed", "project_delivered"].includes(o.status),
      ).length,
      totalRevenue: orders
        .filter((o) => o.finalPrice && o.status === "project_delivered")
        .reduce((sum, o) => sum + (o.finalPrice || 0), 0),
    };
  }

  // Initialisation et migration
  initialize(): void {
    // Vérifier si une migration est nécessaire
    const orders = this.getOrders();
    if (orders.length === 0) {
      this.migrateFromLegacyQuoteRequests();
    }
  }
}

export const orderService = new OrderService();
