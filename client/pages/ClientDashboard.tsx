import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  Download,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Plus,
  Activity as Progress,
  Search,
  Send,
  Star,
  Upload,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Package,
  DollarSign,
} from "lucide-react";
import { orderService } from "../services/orderService";
import { Order, OrderMessage, OrderNotification } from "../types/orders";

const statusConfig = {
  quote_requested: {
    label: "Devis demandé",
    color: "bg-blue-500",
    icon: FileText,
  },
  quote_reviewing: { label: "En examen", color: "bg-yellow-500", icon: Clock },
  quote_sent: { label: "Devis envoyé", color: "bg-purple-500", icon: Send },
  quote_accepted: {
    label: "Devis accepté",
    color: "bg-green-500",
    icon: CheckCircle,
  },
  quote_rejected: { label: "Devis refusé", color: "bg-red-500", icon: XCircle },
  project_started: {
    label: "Projet démarré",
    color: "bg-indigo-500",
    icon: Package,
  },
  project_in_progress: {
    label: "En cours",
    color: "bg-blue-600",
    icon: Progress,
  },
  project_review: {
    label: "En révision",
    color: "bg-orange-500",
    icon: AlertCircle,
  },
  project_completed: {
    label: "Terminé",
    color: "bg-green-600",
    icon: CheckCircle,
  },
  project_delivered: { label: "Livré", color: "bg-emerald-600", icon: Star },
  archived: { label: "Archivé", color: "bg-gray-500", icon: Package },
};

export default function ClientDashboard() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    // Initialiser le service de commandes
    orderService.initialize();

    // Charger les commandes du client
    const clientOrders = orderService
      .getOrders()
      .filter(
        (order) =>
          order.client.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
    setOrders(clientOrders);

    // Charger les notifications du client
    const clientNotifications = orderService
      .getNotifications()
      .filter(
        (notif) =>
          notif.recipientType === "client" &&
          clientOrders.some((order) => order.id === notif.orderId),
      );
    setNotifications(clientNotifications);

    // Écouter les mises à jour en temps réel
    const handleOrderUpdate = (event: CustomEvent) => {
      const updatedOrders = orderService
        .getOrders()
        .filter(
          (order) =>
            order.client.email.toLowerCase() ===
            currentUser.email.toLowerCase(),
        );
      setOrders(updatedOrders);
    };

    const handleNewNotification = (event: CustomEvent) => {
      const notification = event.detail as OrderNotification;
      const userOrders = orderService
        .getOrders()
        .filter(
          (order) =>
            order.client.email.toLowerCase() ===
            currentUser.email.toLowerCase(),
        );

      if (
        notification.recipientType === "client" &&
        userOrders.some((order) => order.id === notification.orderId)
      ) {
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    window.addEventListener(
      "orderStatusChanged",
      handleOrderUpdate as EventListener,
    );
    window.addEventListener(
      "newOrderNotification",
      handleNewNotification as EventListener,
    );

    return () => {
      window.removeEventListener(
        "orderStatusChanged",
        handleOrderUpdate as EventListener,
      );
      window.removeEventListener(
        "newOrderNotification",
        handleNewNotification as EventListener,
      );
    };
  }, [currentUser]);

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/" replace />;
  }

  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const activeProjects = orders.filter((o) =>
    ["project_started", "project_in_progress", "project_review"].includes(
      o.status,
    ),
  );
  const completedProjects = orders.filter((o) =>
    ["project_completed", "project_delivered"].includes(o.status),
  );

  const sendMessage = () => {
    if (!selectedOrder || !newMessage.trim()) return;

    orderService.addMessage(selectedOrder.id, {
      senderId: currentUser.email,
      senderType: "client",
      content: newMessage.trim(),
      read: false,
    });

    setNewMessage("");

    // Recharger les commandes pour voir le nouveau message
    const updatedOrders = orderService
      .getOrders()
      .filter(
        (order) =>
          order.client.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
    setOrders(updatedOrders);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projets</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-orange-600">
                {activeProjects.length}
              </p>
            </div>
            <Progress className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-green-600">
                {completedProjects.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-red-600">
                {unreadNotifications}
              </p>
            </div>
            <Bell className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Projets récents */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Vos Projets</h3>
        </div>
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun projet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par demander un devis via notre chat bot.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setActiveSection("projects");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${config.color}`}
                        ></div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {order.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {order.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {order.progress}%
                          </p>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {selectedOrder ? (
        /* Vue détaillée du projet */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedOrder.title}
                  </h2>
                  <p className="text-gray-600">{selectedOrder.category}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusConfig[selectedOrder.status].color}`}
                  >
                    {statusConfig[selectedOrder.status].label}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Créé le {selectedOrder.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Détails du projet */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700">{selectedOrder.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Progression
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avancement</span>
                        <span>{selectedOrder.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${selectedOrder.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Messages
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedOrder.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.senderType === "client"
                              ? "bg-blue-50 ml-8"
                              : "bg-gray-50 mr-8"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">
                              {message.senderType === "client"
                                ? "Vous"
                                : "Équipe Mind Graphix"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleDateString()}{" "}
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Nouveau message */}
                    <div className="mt-4 flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informations latérales */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Informations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">
                          {selectedOrder.budget}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Délais:</span>
                        <span className="font-medium">
                          {selectedOrder.timeline}
                        </span>
                      </div>
                      {selectedOrder.quotedPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prix devis:</span>
                          <span className="font-medium">
                            {selectedOrder.quotedPrice} FCFA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fichiers */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Fichiers ({selectedOrder.files.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center space-x-2 p-2 border rounded-lg"
                        >
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.uploadedBy === "client" ? "Vous" : "Équipe"}{" "}
                              • {file.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {selectedOrder.files.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun fichier
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Liste des projets */
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Tous vos projets
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aucun projet pour le moment
                </h3>
                <p className="mt-2 text-gray-500">
                  Demandez un devis via notre chat bot pour commencer votre
                  premier projet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map((order) => {
                  const config = statusConfig[order.status];
                  const StatusIcon = config.icon;

                  return (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.title}
                          </h3>
                          <p className="text-gray-600">{order.category}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {order.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">{order.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Créé le {order.createdAt.toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {order.messages.length}
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {order.files.length}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucune notification
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous recevrez ici les mises à jour de vos projets.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.read
                      ? "bg-gray-50 border-l-gray-300"
                      : "bg-blue-50 border-l-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4
                        className={`font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}
                      >
                        {notification.title}
                      </h4>
                      <p
                        className={`text-sm mt-1 ${notification.read ? "text-gray-600" : "text-gray-700"}`}
                      >
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const menuItems = [
    { id: "overview", label: "Vue d'ensemble", icon: Home },
    { id: "projects", label: "Mes projets", icon: Package },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Espace Client
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || currentUser?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                    {item.id === "notifications" && unreadNotifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeSection === "overview" && renderOverview()}
            {activeSection === "projects" && renderProjects()}
            {activeSection === "notifications" && renderNotifications()}
          </main>
        </div>
      </div>
    </div>
  );
}
