import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  UserCheck,
  UserPlus,
  Clock,
  MapPin,
  Phone,
  Mail,
  Eye,
  Activity,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Star,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Heart,
  Target,
  BarChart3,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: "actif" | "inactif" | "nouveau" | "potentiel";
  lastActivity: Date;
  interactions: number;
  source: "site" | "social" | "referral" | "direct";
  interest: string[];
  sessionDuration: number;
  pageViews: number;
  device: "desktop" | "mobile" | "tablet";
}

interface Message {
  id: string;
  from: "client" | "admin" | "bot";
  content: string;
  timestamp: Date;
  clientId?: string;
  type: "message" | "notification" | "alert";
}

export const ClientTrackingBot: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "tracking" | "messages" | "analytics"
  >("tracking");
  const [clients, setClients] = useState<ClientData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [filter, setFilter] = useState<
    "all" | "actif" | "nouveau" | "potentiel"
  >("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Données simulées pour les clients
  useEffect(() => {
    const mockClients: ClientData[] = [
      {
        id: "1",
        name: "Marie Ouédraogo",
        email: "marie@example.com",
        phone: "+226 70 12 34 56",
        location: "Ouagadougou, Burkina Faso",
        status: "actif",
        lastActivity: new Date(Date.now() - 5 * 60000),
        interactions: 12,
        source: "site",
        interest: ["développement web", "e-commerce"],
        sessionDuration: 1420,
        pageViews: 8,
        device: "desktop",
      },
      {
        id: "2",
        name: "Amadou Traoré",
        email: "amadou@example.com",
        phone: "+226 75 98 76 54",
        location: "Bobo-Dioulasso, Burkina Faso",
        status: "nouveau",
        lastActivity: new Date(Date.now() - 15 * 60000),
        interactions: 2,
        source: "social",
        interest: ["design graphique"],
        sessionDuration: 680,
        pageViews: 4,
        device: "mobile",
      },
      {
        id: "3",
        name: "Fatimata Sawadogo",
        email: "fatimata@example.com",
        location: "Koudougou, Burkina Faso",
        status: "potentiel",
        lastActivity: new Date(Date.now() - 45 * 60000),
        interactions: 5,
        source: "referral",
        interest: ["marketing digital", "SEO"],
        sessionDuration: 980,
        pageViews: 6,
        device: "tablet",
      },
      {
        id: "4",
        name: "Ibrahim Compaoré",
        email: "ibrahim@example.com",
        phone: "+226 78 45 67 89",
        location: "Ouagadougou, Burkina Faso",
        status: "actif",
        lastActivity: new Date(Date.now() - 2 * 60000),
        interactions: 18,
        source: "direct",
        interest: ["développement mobile", "applications"],
        sessionDuration: 2340,
        pageViews: 15,
        device: "desktop",
      },
    ];
    setClients(mockClients);

    // Messages simulés
    const mockMessages: Message[] = [
      {
        id: "1",
        from: "client",
        content:
          "Bonjour, j'aimerais avoir plus d'informations sur vos services de développement web.",
        timestamp: new Date(Date.now() - 30 * 60000),
        clientId: "1",
        type: "message",
      },
      {
        id: "2",
        from: "bot",
        content:
          "Nouveau visiteur intéressé par le design graphique - Marie Ouédraogo",
        timestamp: new Date(Date.now() - 25 * 60000),
        type: "notification",
      },
      {
        id: "3",
        from: "client",
        content: "Pouvez-vous m'expliquer vos tarifs pour un site e-commerce ?",
        timestamp: new Date(Date.now() - 20 * 60000),
        clientId: "3",
        type: "message",
      },
      {
        id: "4",
        from: "bot",
        content:
          "Client actif depuis 23 minutes - Ibrahim Compaoré visite la page Services",
        timestamp: new Date(Date.now() - 10 * 60000),
        type: "alert",
      },
    ];
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredClients = clients.filter(
    (client) => filter === "all" || client.status === filter,
  );

  const addMessage = (
    content: string,
    from: "admin" | "bot" = "admin",
    clientId?: string,
  ) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      from,
      content,
      timestamp: new Date(),
      clientId,
      type: "message",
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addMessage(newMessage, "admin", selectedClient?.id);
    setNewMessage("");

    // Simuler une réponse du client après 2-5 secondes
    setTimeout(
      () => {
        const responses = [
          "Merci pour votre réponse ! Pouvez-vous m'en dire plus ?",
          "C'est exactement ce que je cherchais !",
          "Quels sont vos délais de livraison ?",
          "Pouvons-nous planifier un appel téléphonique ?",
          "J'aimerais voir quelques exemples de vos réalisations.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, "admin", selectedClient?.id);
      },
      Math.random() * 3000 + 2000,
    );
  };

  const getStatusColor = (status: ClientData["status"]) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "nouveau":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "potentiel":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDeviceIcon = (device: ClientData["device"]) => {
    switch (device) {
      case "desktop":
        return <Monitor size={16} />;
      case "mobile":
        return <Smartphone size={16} />;
      case "tablet":
        return <Globe size={16} />;
    }
  };

  // Affichage pour tous les administrateurs (standard, mind, supreme)
  if (!isAdmin) return null;

  return (
    <>
      {/* Bouton flottant du bot de suivi */}
      <motion.div
        className="fixed bottom-28 right-6 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-400 hover:via-indigo-400 hover:to-violet-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          title="ClientTracker - Suivi Admin"
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>

          {/* Contenu principal - Version boule */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative">
              <Users
                size={24}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Effet hover shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </motion.button>
      </motion.div>

      {/* Interface du bot de suivi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] m-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Users size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        Bot de Suivi Client
                      </h2>
                      <p className="text-emerald-100">
                        Suivi en temps réel et interaction client
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm opacity-90">
                        {filteredClients.length} clients
                      </div>
                      <div className="text-xs opacity-75">
                        {clients.filter((c) => c.status === "actif").length}{" "}
                        actifs
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <X size={24} />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mt-6">
                  {[
                    { id: "tracking", label: "Suivi Client", icon: Eye },
                    { id: "messages", label: "Messages", icon: MessageCircle },
                    { id: "analytics", label: "Analytics", icon: BarChart3 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "text-emerald-100 hover:bg-white/10"
                      }`}
                    >
                      <tab.icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === "tracking" && (
                  <div className="space-y-6">
                    {/* Filtres */}
                    <div className="flex items-center space-x-4">
                      <Filter size={20} className="text-gray-500" />
                      <div className="flex space-x-2">
                        {["all", "actif", "nouveau", "potentiel"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => setFilter(status as any)}
                              className={`px-3 py-1 rounded-full text-sm transition-all ${
                                filter === status
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {status === "all" ? "Tous" : status}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Liste des clients */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredClients.map((client) => (
                        <motion.div
                          key={client.id}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedClient(client)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                {client.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {client.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {client.email}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}
                            >
                              {client.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>
                                {Math.floor(
                                  (Date.now() - client.lastActivity.getTime()) /
                                    60000,
                                )}
                                min
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Activity size={14} />
                              <span>{client.interactions} interactions</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getDeviceIcon(client.device)}
                              <span className="capitalize">
                                {client.device}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>
                                {client.location?.split(",")[0] || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {client.interest.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "messages" && (
                  <div className="space-y-4">
                    {/* Messages */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          className={`flex ${message.from === "admin" ? "justify-end" : "justify-start"}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div
                            className={`max-w-md p-3 rounded-lg ${
                              message.from === "admin"
                                ? "bg-emerald-600 text-white"
                                : message.from === "client"
                                  ? "bg-gray-100 text-gray-900"
                                  : "bg-blue-50 text-blue-900 border border-blue-200"
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.from === "admin"
                                  ? "text-emerald-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                              {message.from !== "admin" && (
                                <span className="ml-2 capitalize">
                                  • {message.from}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center space-x-2 border-t pt-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    {/* Métriques principales */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600">
                              Visiteurs Actifs
                            </p>
                            <p className="text-2xl font-bold text-blue-800">
                              {
                                clients.filter((c) => c.status === "actif")
                                  .length
                              }
                            </p>
                          </div>
                          <Users className="text-blue-600" size={24} />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600">
                              Nouveaux Clients
                            </p>
                            <p className="text-2xl font-bold text-green-800">
                              {
                                clients.filter((c) => c.status === "nouveau")
                                  .length
                              }
                            </p>
                          </div>
                          <UserPlus className="text-green-600" size={24} />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600">
                              Interactions
                            </p>
                            <p className="text-2xl font-bold text-yellow-800">
                              {clients.reduce(
                                (sum, c) => sum + c.interactions,
                                0,
                              )}
                            </p>
                          </div>
                          <Activity className="text-yellow-600" size={24} />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600">
                              Temps Moyen
                            </p>
                            <p className="text-2xl font-bold text-purple-800">
                              {Math.round(
                                clients.reduce(
                                  (sum, c) => sum + c.sessionDuration,
                                  0,
                                ) /
                                  clients.length /
                                  60,
                              )}
                              min
                            </p>
                          </div>
                          <Clock className="text-purple-600" size={24} />
                        </div>
                      </div>
                    </div>

                    {/* Graphique des sources */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Sources de Trafic</h3>
                      <div className="space-y-2">
                        {["site", "social", "referral", "direct"].map(
                          (source) => {
                            const count = clients.filter(
                              (c) => c.source === source,
                            ).length;
                            const percentage = (count / clients.length) * 100;
                            return (
                              <div
                                key={source}
                                className="flex items-center space-x-3"
                              >
                                <div className="w-20 text-sm text-gray-600 capitalize">
                                  {source}
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="text-sm font-medium w-12">
                                  {count}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientTrackingBot;
