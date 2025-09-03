import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Users,
  Settings,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "system" | "content" | "user" | "admin" | "security";
  level: "read" | "write" | "execute" | "admin";
  critical: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  created: Date;
  lastModified: Date;
  active: boolean;
  system: boolean;
}

interface AccessRule {
  id: string;
  name: string;
  type: "allow" | "deny" | "conditional";
  resource: string;
  conditions: {
    timeRange?: { start: string; end: string };
    ipRange?: string[];
    deviceType?: string[];
    location?: string[];
    userAgent?: string[];
  };
  priority: number;
  active: boolean;
  created: Date;
}

interface AccessLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  result: "granted" | "denied" | "restricted";
  reason: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

export const AccessControlCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("permissions");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Exclusivement pour Philippe
  const isPhilippeSupreme =
    currentUser?.email === "philippefaizsanon@gmail.com";

  // Permissions système
  const systemPermissions: Permission[] = [
    // Système
    {
      id: "system.read",
      name: "Lecture Système",
      description: "Consulter les informations système",
      category: "system",
      level: "read",
      critical: false,
    },
    {
      id: "system.write",
      name: "Écriture Système",
      description: "Modifier les paramètres système",
      category: "system",
      level: "write",
      critical: true,
    },
    {
      id: "system.admin",
      name: "Administration Système",
      description: "Contrôle complet du système",
      category: "system",
      level: "admin",
      critical: true,
    },

    // Contenu
    {
      id: "content.read",
      name: "Lecture Contenu",
      description: "Consulter le contenu",
      category: "content",
      level: "read",
      critical: false,
    },
    {
      id: "content.write",
      name: "Écriture Contenu",
      description: "Modifier le contenu",
      category: "content",
      level: "write",
      critical: false,
    },
    {
      id: "content.publish",
      name: "Publication",
      description: "Publier du contenu",
      category: "content",
      level: "execute",
      critical: false,
    },

    // Utilisateurs
    {
      id: "user.read",
      name: "Lecture Utilisateurs",
      description: "Consulter les utilisateurs",
      category: "user",
      level: "read",
      critical: false,
    },
    {
      id: "user.write",
      name: "Gestion Utilisateurs",
      description: "Créer/modifier des utilisateurs",
      category: "user",
      level: "write",
      critical: true,
    },
    {
      id: "user.delete",
      name: "Suppression Utilisateurs",
      description: "Supprimer des utilisateurs",
      category: "user",
      level: "admin",
      critical: true,
    },

    // Administration
    {
      id: "admin.panel",
      name: "Panneau Admin",
      description: "Accès au panneau d'administration",
      category: "admin",
      level: "read",
      critical: false,
    },
    {
      id: "admin.settings",
      name: "Paramètres Admin",
      description: "Modifier les paramètres admin",
      category: "admin",
      level: "write",
      critical: true,
    },
    {
      id: "admin.users",
      name: "Gestion Admins",
      description: "Gérer les administrateurs",
      category: "admin",
      level: "admin",
      critical: true,
    },

    // Sécurité
    {
      id: "security.read",
      name: "Lecture Sécurité",
      description: "Consulter les logs de sécurité",
      category: "security",
      level: "read",
      critical: false,
    },
    {
      id: "security.monitor",
      name: "Monitoring Sécurité",
      description: "Surveiller la sécurité",
      category: "security",
      level: "write",
      critical: true,
    },
    {
      id: "security.admin",
      name: "Administration Sécurité",
      description: "Contrôle total de la sécurité",
      category: "security",
      level: "admin",
      critical: true,
    },
  ];

  // Rôles par défaut
  const defaultRoles: Role[] = [
    {
      id: "supreme",
      name: "Administrateur Suprême",
      description: "Accès complet à toutes les fonctionnalités",
      permissions: systemPermissions.map((p) => p.id),
      userCount: 1,
      created: new Date("2024-01-01"),
      lastModified: new Date(),
      active: true,
      system: true,
    },
    {
      id: "admin",
      name: "Administrateur",
      description: "Gestion du contenu et des utilisateurs",
      permissions: [
        "content.read",
        "content.write",
        "content.publish",
        "user.read",
        "user.write",
        "admin.panel",
        "admin.settings",
        "security.read",
      ],
      userCount: 3,
      created: new Date("2024-01-01"),
      lastModified: new Date(),
      active: true,
      system: true,
    },
    {
      id: "moderator",
      name: "Modérateur",
      description: "Modération du contenu",
      permissions: [
        "content.read",
        "content.write",
        "user.read",
        "admin.panel",
      ],
      userCount: 2,
      created: new Date("2024-01-01"),
      lastModified: new Date(),
      active: true,
      system: false,
    },
    {
      id: "editor",
      name: "Éditeur",
      description: "Édition du contenu uniquement",
      permissions: ["content.read", "content.write"],
      userCount: 5,
      created: new Date("2024-01-01"),
      lastModified: new Date(),
      active: true,
      system: false,
    },
  ];

  // Règles d'accès par défaut
  const defaultAccessRules: AccessRule[] = [
    {
      id: "rule-1",
      name: "Restriction Heures de Bureau",
      type: "conditional",
      resource: "admin.*",
      conditions: {
        timeRange: { start: "08:00", end: "18:00" },
      },
      priority: 100,
      active: true,
      created: new Date("2024-01-01"),
    },
    {
      id: "rule-2",
      name: "Blocage IP Suspects",
      type: "deny",
      resource: "*",
      conditions: {
        ipRange: ["192.168.0.100", "10.0.0.50"],
      },
      priority: 200,
      active: true,
      created: new Date("2024-01-01"),
    },
    {
      id: "rule-3",
      name: "Accès Mobile Limité",
      type: "conditional",
      resource: "system.*",
      conditions: {
        deviceType: ["mobile", "tablet"],
      },
      priority: 50,
      active: true,
      created: new Date("2024-01-01"),
    },
  ];

  // Logs d'accès simulés
  const generateAccessLogs = (): AccessLog[] => {
    const users = [
      "philippefaizsanon@gmail.com",
      "admin@mindgraphix.com",
      "user@example.com",
      "editor@company.com",
    ];

    const actions = [
      "login",
      "logout",
      "content.edit",
      "user.view",
      "admin.settings",
      "system.backup",
      "security.monitor",
      "content.publish",
    ];

    const results: Array<"granted" | "denied" | "restricted"> = [
      "granted",
      "denied",
      "restricted",
    ];

    const logs: AccessLog[] = [];

    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const result = results[Math.floor(Math.random() * results.length)];

      logs.push({
        id: `log-${i}`,
        userId: `user-${i}`,
        userEmail: user,
        action,
        resource: action,
        result,
        reason:
          result === "granted"
            ? "Permission accordée"
            : result === "denied"
              ? "Permission refusée"
              : "Accès restreint",
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ),
      });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Initialisation
  useEffect(() => {
    setPermissions(systemPermissions);
    setRoles(defaultRoles);
    setAccessRules(defaultAccessRules);
    setAccessLogs(generateAccessLogs());
  }, []);

  // Filtrage
  const filteredPermissions = permissions.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredRoles = roles.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Gestion des rôles
  const createRole = () => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: "Nouveau Rôle",
      description: "Description du nouveau rôle",
      permissions: [],
      userCount: 0,
      created: new Date(),
      lastModified: new Date(),
      active: true,
      system: false,
    };
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setIsEditing(true);
  };

  const updateRole = (updatedRole: Role) => {
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    setSelectedRole(updatedRole);
  };

  const deleteRole = (roleId: string) => {
    if (confirm("Supprimer ce rôle ?")) {
      setRoles(roles.filter((r) => r.id !== roleId));
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
    }
  };

  // Export des données
  const exportAccessData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      permissions: filteredPermissions,
      roles: filteredRoles,
      accessRules,
      recentLogs: accessLogs.slice(0, 100),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `access-control-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helpers
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "system":
        return "bg-red-100 text-red-800";
      case "content":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "security":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "read":
        return <Eye size={14} />;
      case "write":
        return <Edit size={14} />;
      case "execute":
        return <Settings size={14} />;
      case "admin":
        return <Shield size={14} />;
      default:
        return <Key size={14} />;
    }
  };

  const getResultColor = (result: string): string => {
    switch (result) {
      case "granted":
        return "text-green-600";
      case "denied":
        return "text-red-600";
      case "restricted":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isPhilippeSupreme) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-128 right-4 z-40 w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group"
        title="Contrôle d'Accès"
      >
        <Shield size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield size={24} />
                  <div>
                    <h2 className="text-2xl font-bold">
                      Centre de Contrôle d'Accès
                    </h2>
                    <p className="text-orange-200 text-sm">
                      {permissions.length} permissions • {roles.length} rôles •
                      {accessRules.filter((r) => r.active).length} règles
                      actives
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={exportAccessData}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-orange-600"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-orange-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mt-4">
                {[
                  { id: "permissions", label: "Permissions", icon: Key },
                  { id: "roles", label: "Rôles", icon: Users },
                  { id: "rules", label: "Règles", icon: Settings },
                  { id: "logs", label: "Logs", icon: Clock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-orange-600"
                        : "text-orange-200 hover:text-white hover:bg-orange-800"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="relative">
                <Key
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Rechercher permissions, rôles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-250px)] overflow-y-auto">
              {activeTab === "permissions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Permissions Système ({filteredPermissions.length})
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {filteredPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getLevelIcon(permission.level)}
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(permission.category)}`}
                              >
                                {permission.category}
                              </span>
                              {permission.critical && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
                                  CRITIQUE
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {permission.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                permission.level === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : permission.level === "write"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {permission.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "roles" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Rôles d'Accès ({filteredRoles.length})
                    </h3>
                    <Button onClick={createRole} size="sm">
                      <Plus size={16} className="mr-2" />
                      Nouveau Rôle
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {filteredRoles.map((role) => (
                      <div
                        key={role.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Users size={20} className="text-gray-600" />
                              {role.system && (
                                <Shield size={16} className="text-red-500" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {role.name}
                                </h4>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    role.active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {role.active ? "Actif" : "Inactif"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {role.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                                <span>{role.userCount} utilisateurs</span>
                                <span>
                                  {role.permissions.length} permissions
                                </span>
                                <span>
                                  Modifié:{" "}
                                  {role.lastModified.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => setSelectedRole(role)}
                              size="sm"
                              variant="outline"
                              title="Voir détails"
                            >
                              <Eye size={16} />
                            </Button>
                            {!role.system && (
                              <>
                                <Button
                                  onClick={() => {
                                    setSelectedRole(role);
                                    setIsEditing(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  title="Modifier"
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  onClick={() => deleteRole(role.id)}
                                  size="sm"
                                  variant="destructive"
                                  title="Supprimer"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Logs d'Accès Récents ({accessLogs.length})
                  </h3>

                  <div className="space-y-2">
                    {accessLogs.slice(0, 20).map((log) => (
                      <div
                        key={log.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                log.result === "granted"
                                  ? "bg-green-100 text-green-600"
                                  : log.result === "denied"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {log.result === "granted" ? (
                                <CheckCircle size={16} />
                              ) : log.result === "denied" ? (
                                <X size={16} />
                              ) : (
                                <AlertTriangle size={16} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {log.userEmail}
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                                <span className="text-sm text-gray-700">
                                  {log.action}
                                </span>
                                <span
                                  className={`text-sm font-medium ${getResultColor(log.result)}`}
                                >
                                  {log.result.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
                                <span>{log.ip}</span>
                                <span>{log.timestamp.toLocaleString()}</span>
                                <span>{log.reason}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
