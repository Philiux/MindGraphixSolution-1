import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Crown,
  Star,
  Users,
  Settings,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super" | "mind";
  status: "active" | "inactive" | "suspended";
  lastLogin: Date;
  permissions: string[];
  createdAt: Date;
  avatar?: string;
  phone?: string;
  location?: string;
}

interface AdminAction {
  id: string;
  type: "create" | "update" | "delete" | "login" | "permission";
  user: string;
  target?: string;
  description: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
}

export const AdminPermissionManager: React.FC = () => {
  const { currentUser, isAdmin, isSuperAdmin, isMindAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "permissions" | "audit">(
    "users",
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Données simulées des utilisateurs
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Philippe Faiz Sanon",
      email: "admin@mindgraphix.com",
      role: "mind",
      status: "active",
      lastLogin: new Date(),
      permissions: ["all"],
      createdAt: new Date("2024-01-01"),
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      phone: "+226 54191605",
      location: "Bobo-Dioulasso, Burkina Faso",
    },
    {
      id: "2",
      name: "Admin Principal",
      email: "super@mindgraphix.com",
      role: "super",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: ["users", "content", "settings", "security"],
      createdAt: new Date("2024-01-15"),
      phone: "+226 12345678",
    },
    {
      id: "3",
      name: "Admin Standard",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      permissions: ["content", "users_view"],
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "4",
      name: "Utilisateur Test",
      email: "user@example.com",
      role: "user",
      status: "inactive",
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      permissions: ["profile"],
      createdAt: new Date("2024-02-15"),
    },
  ]);

  // Actions d'audit simulées
  const auditActions: AdminAction[] = [
    {
      id: "1",
      type: "permission",
      user: "Philippe Faiz Sanon",
      target: "Admin Standard",
      description: "Permissions modifiées pour Admin Standard",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "medium",
    },
    {
      id: "2",
      type: "create",
      user: "Admin Principal",
      description: "Nouveau compte utilisateur créé",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: "low",
    },
    {
      id: "3",
      type: "login",
      user: "Admin Standard",
      description: "Connexion échouée - tentative d'accès non autorisé",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: "high",
    },
  ];

  const roleLabels = {
    mind: {
      label: "Mind Admin",
      icon: Crown,
      color: "text-yellow-600 bg-yellow-100",
      level: 4,
    },
    super: {
      label: "Super Admin",
      icon: Shield,
      color: "text-blue-600 bg-blue-100",
      level: 3,
    },
    admin: {
      label: "Admin",
      icon: Star,
      color: "text-green-600 bg-green-100",
      level: 2,
    },
    user: {
      label: "Utilisateur",
      icon: Users,
      color: "text-gray-600 bg-gray-100",
      level: 1,
    },
  };

  const statusLabels = {
    active: { label: "Actif", color: "text-green-600 bg-green-100" },
    inactive: { label: "Inactif", color: "text-gray-600 bg-gray-100" },
    suspended: { label: "Suspendu", color: "text-red-600 bg-red-100" },
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const canManageUser = (targetUser: User) => {
    if (isMindAdmin) return true;
    if (isSuperAdmin && targetUser.role !== "mind") return true;
    if (isAdmin && targetUser.role === "user") return true;
    return false;
  };

  const getRoleIcon = (role: string) => {
    const roleInfo = roleLabels[role as keyof typeof roleLabels];
    return roleInfo ? roleInfo.icon : Users;
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 border-red-300";
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-300";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "low":
        return "text-blue-600 bg-blue-100 border-blue-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accès Restreint
          </h3>
          <p className="text-gray-600">
            Vous devez être administrateur pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Utilisateurs",
            value: users.length,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Administrateurs",
            value: users.filter((u) => u.role !== "user").length,
            icon: Shield,
            color: "text-green-600",
          },
          {
            label: "Actifs",
            value: users.filter((u) => u.status === "active").length,
            icon: CheckCircle,
            color: "text-emerald-600",
          },
          {
            label: "Connexions 24h",
            value: users.filter(
              (u) => Date.now() - u.lastLogin.getTime() < 24 * 60 * 60 * 1000,
            ).length,
            icon: Clock,
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "users", label: "Utilisateurs", icon: Users },
              { id: "permissions", label: "Permissions", icon: Lock },
              { id: "audit", label: "Audit", icon: Eye },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Utilisateurs */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Contrôles */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="mind">Mind Admin</option>
                    <option value="super">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">Utilisateur</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  {isSuperAdmin && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <UserPlus size={20} className="mr-2" />
                      Nouveau
                    </Button>
                  )}

                  <Button variant="outline" className="border-gray-300">
                    <RefreshCw size={20} className="mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>

              {/* Liste des utilisateurs */}
              <div className="grid gap-4">
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  const roleInfo = roleLabels[user.role];
                  const statusInfo = statusLabels[user.status];

                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">
                                {user.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}
                              >
                                <RoleIcon size={12} className="inline mr-1" />
                                {roleInfo.label}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Mail size={14} className="mr-1" />
                                {user.email}
                              </span>
                              {user.phone && (
                                <span className="flex items-center">
                                  <Phone size={14} className="mr-1" />
                                  {user.phone}
                                </span>
                              )}
                              {user.location && (
                                <span className="flex items-center">
                                  <MapPin size={14} className="mr-1" />
                                  {user.location}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                Dernière connexion:{" "}
                                {formatLastLogin(user.lastLogin)}
                              </span>
                              <span className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                Créé: {user.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {canManageUser(user) && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="border-gray-300"
                              >
                                <Edit size={16} className="mr-1" />
                                Modifier
                              </Button>

                              {user.role !== "mind" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} className="mr-1" />
                                  Supprimer
                                </Button>
                              )}
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Onglet Permissions */}
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gestion des Permissions
                </h3>
                <p className="text-gray-600">
                  Configurez les permissions détaillées pour chaque rôle.
                </p>
                {!isSuperAdmin && (
                  <p className="text-sm text-orange-600 mt-2">
                    Accès Super Admin requis
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Onglet Audit */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Journal d'Audit
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-300">
                    <Download size={16} className="mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Filter size={16} className="mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {auditActions.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${getSeverityColor(action.severity)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getSeverityColor(action.severity)}`}
                        >
                          {action.severity === "critical" && (
                            <AlertTriangle size={16} />
                          )}
                          {action.severity === "high" && (
                            <AlertTriangle size={16} />
                          )}
                          {action.severity === "medium" && <Bell size={16} />}
                          {action.severity === "low" && (
                            <CheckCircle size={16} />
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {action.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            Par {action.user}{" "}
                            {action.target && `→ ${action.target}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(action.severity)}`}
                        >
                          {action.severity.toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {action.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
