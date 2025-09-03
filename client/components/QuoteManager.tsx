import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  X,
  Eye,
  Edit,
  Send,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Archive,
  Filter,
  Search,
  Package,
  XCircle,
} from "lucide-react";
import { orderService } from "../services/orderService";
import { Order, OrderStatus } from "../types/orders";

export const QuoteManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");

  useEffect(() => {
    // Initialiser et charger les commandes
    orderService.initialize();
    loadOrders();

    // Écouter les mises à jour en temps réel
    const handleOrderUpdate = () => {
      loadOrders();
    };

    window.addEventListener("orderStatusChanged", handleOrderUpdate);
    window.addEventListener("newOrderNotification", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderStatusChanged", handleOrderUpdate);
      window.removeEventListener("newOrderNotification", handleOrderUpdate);
    };
  }, []);

  const loadOrders = () => {
    const allOrders = orderService.getOrders();
    setOrders(allOrders);
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus,
    notes?: string,
    amount?: string,
  ) => {
    orderService.updateOrderStatus(id, status);

    // Ajouter une note admin si fournie
    if (notes) {
      orderService.addMessage(id, {
        senderId: "admin@system",
        senderType: "admin",
        content: `Note admin: ${notes}`,
        read: false,
      });
    }

    // Si un montant est fourni et qu'on envoie un devis
    if (amount && status === "quote_sent") {
      const updatedOrders = orderService.getOrders();
      const orderIndex = updatedOrders.findIndex((o) => o.id === id);
      if (orderIndex !== -1) {
        updatedOrders[orderIndex].quotedPrice = parseFloat(amount);
        localStorage.setItem("unified_orders", JSON.stringify(updatedOrders));
      }
    }

    loadOrders();
  };

  const getStatusColor = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      quote_requested: "bg-blue-100 text-blue-800",
      quote_reviewing: "bg-yellow-100 text-yellow-800",
      quote_sent: "bg-purple-100 text-purple-800",
      quote_accepted: "bg-green-100 text-green-800",
      quote_rejected: "bg-red-100 text-red-800",
      project_started: "bg-indigo-100 text-indigo-800",
      project_in_progress: "bg-blue-100 text-blue-800",
      project_review: "bg-orange-100 text-orange-800",
      project_completed: "bg-green-100 text-green-800",
      project_delivered: "bg-emerald-100 text-emerald-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: OrderStatus) => {
    const statusIcons: Record<OrderStatus, any> = {
      quote_requested: AlertCircle,
      quote_reviewing: Clock,
      quote_sent: Send,
      quote_accepted: CheckCircle,
      quote_rejected: XCircle,
      project_started: Package,
      project_in_progress: Clock,
      project_review: Eye,
      project_completed: CheckCircle,
      project_delivered: CheckCircle,
      archived: Archive,
    };
    return statusIcons[status] || FileText;
  };

  const getStatusLabel = (status: OrderStatus) => {
    const statusLabels: Record<OrderStatus, string> = {
      quote_requested: "Nouveau devis",
      quote_reviewing: "En examen",
      quote_sent: "Devis envoyé",
      quote_accepted: "Devis accepté",
      quote_rejected: "Devis refusé",
      project_started: "Projet démarré",
      project_in_progress: "En cours",
      project_review: "En révision",
      project_completed: "Terminé",
      project_delivered: "Livré",
      archived: "Archivé",
    };
    return statusLabels[status] || status;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      (order.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.client?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.client?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    quote_requested: orders.filter((o) => o.status === "quote_requested")
      .length,
    quote_reviewing: orders.filter((o) => o.status === "quote_reviewing")
      .length,
    quote_sent: orders.filter((o) => o.status === "quote_sent").length,
    quote_accepted: orders.filter((o) => o.status === "quote_accepted").length,
    project_in_progress: orders.filter((o) =>
      ["project_started", "project_in_progress", "project_review"].includes(
        o.status,
      ),
    ).length,
    project_completed: orders.filter((o) =>
      ["project_completed", "project_delivered"].includes(o.status),
    ).length,
  };

  const sendQuoteWithAmount = () => {
    if (selectedOrder && quotedAmount) {
      updateOrderStatus(
        selectedOrder.id,
        "quote_sent",
        adminNotes,
        quotedAmount,
      );
      setShowDetails(false);
      setAdminNotes("");
      setQuotedAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Devis</h2>
        <div className="text-sm text-gray-600">
          {orders.length} commande{orders.length > 1 ? "s" : ""} au total
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-blue-600">Nouveaux</p>
          <p className="text-2xl font-bold text-blue-600">
            {statusCounts.quote_requested}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-yellow-600">En examen</p>
          <p className="text-2xl font-bold text-yellow-600">
            {statusCounts.quote_reviewing}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-purple-600">Devis envoyés</p>
          <p className="text-2xl font-bold text-purple-600">
            {statusCounts.quote_sent}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-indigo-600">En cours</p>
          <p className="text-2xl font-bold text-indigo-600">
            {statusCounts.project_in_progress}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-green-600">Terminés</p>
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.project_completed}
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="quote_requested">Nouveaux devis</option>
              <option value="quote_reviewing">En examen</option>
              <option value="quote_sent">Devis envoyés</option>
              <option value="quote_accepted">Acceptés</option>
              <option value="project_in_progress">Projets en cours</option>
              <option value="project_completed">Terminés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune commande
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== "all"
                ? "Aucune commande ne correspond à vos critères de recherche."
                : "Les nouvelles demandes de devis apparaîtront ici."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.client.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.client.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.budget}
                        </div>
                        {order.quotedPrice && (
                          <div className="text-sm text-green-600">
                            Devis: {order.quotedPrice} FCFA
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {order.status === "quote_requested" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "quote_reviewing")
                              }
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                              title="Marquer en examen"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {["quote_requested", "quote_reviewing"].includes(
                            order.status,
                          ) && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetails(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Envoyer un devis"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {order.status === "quote_accepted" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "project_started")
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Démarrer le projet"
                            >
                              <Package className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "archived")
                            }
                            className="text-gray-600 hover:text-gray-900 p-1 rounded"
                            title="Archiver"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Détails de la commande
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setAdminNotes("");
                      setQuotedAmount("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Informations client */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Informations client
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {selectedOrder.client.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {selectedOrder.client.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {selectedOrder.client.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {selectedOrder.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Détails du projet */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Détails du projet
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Titre
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.title}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Catégorie
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.category}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Budget
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedOrder.budget}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Délais
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedOrder.timeline}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.additionalRequirements && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Exigences supplémentaires
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedOrder.additionalRequirements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions admin */}
                  {["quote_requested", "quote_reviewing"].includes(
                    selectedOrder.status,
                  ) && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        Actions administrateur
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Montant du devis (FCFA)
                          </label>
                          <input
                            type="number"
                            value={quotedAmount}
                            onChange={(e) => setQuotedAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: 150000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes administrateur
                          </label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Notes internes ou message pour le client..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {selectedOrder.messages.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        Historique des messages
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedOrder.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-2 rounded text-sm ${
                              message.senderType === "admin"
                                ? "bg-blue-50 text-blue-800"
                                : "bg-gray-50 text-gray-800"
                            }`}
                          >
                            <div className="font-medium">
                              {message.senderType === "admin"
                                ? "Admin"
                                : "Client"}
                            </div>
                            <div>{message.content}</div>
                            <div className="text-xs opacity-75">
                              {message.timestamp.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setAdminNotes("");
                      setQuotedAmount("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>

                  {selectedOrder.status === "quote_requested" && (
                    <button
                      onClick={() => {
                        updateOrderStatus(
                          selectedOrder.id,
                          "quote_reviewing",
                          adminNotes,
                        );
                        setShowDetails(false);
                        setAdminNotes("");
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Marquer en examen
                    </button>
                  )}

                  {["quote_requested", "quote_reviewing"].includes(
                    selectedOrder.status,
                  ) && (
                    <button
                      onClick={sendQuoteWithAmount}
                      disabled={!quotedAmount}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Envoyer le devis
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
