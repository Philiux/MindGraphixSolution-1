import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Settings,
  Eye,
  EyeOff,
  Key,
  Mail,
  User,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  permissions: {
    canManageUsers: boolean;
    canManageContent: boolean;
    canManageDesign: boolean;
    canViewStats: boolean;
    canManageQuotes: boolean;
    canAccessSettings: boolean;
    canManageStyles: boolean;
  };
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  password: string;
}

const defaultPermissions = {
  canManageUsers: false,
  canManageContent: true,
  canManageDesign: true,
  canViewStats: true,
  canManageQuotes: true,
  canAccessSettings: false,
  canManageStyles: false,
};

export const AdvancedAdminManager: React.FC = () => {
  const { isSuperAdmin, isMindAdmin, currentUser } = useAuth();

  // Accès restreint: seulement Philippe, pas l'admin Mind
  const isPhilippeAdmin = currentUser?.email === "philippefaizsanon@gmail.com";
  const isMindAdminStrict =
    isMindAdmin ||
    currentUser?.email === "admin@mindgraphix.com" ||
    currentUser?.role === "mind";

  if (!isSuperAdmin || isMindAdminStrict || !isPhilippeAdmin) return null;

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "super_admin",
    permissions: { ...defaultPermissions },
  });

  useEffect(() => {
    // Charger les administrateurs depuis localStorage
    const loadAdmins = () => {
      const savedAdmins = JSON.parse(
        localStorage.getItem("adminUsers") || "[]",
      );
      setAdmins(
        savedAdmins.map((admin: any) => ({
          ...admin,
          createdAt: new Date(admin.createdAt),
          lastLogin: admin.lastLogin ? new Date(admin.lastLogin) : undefined,
        })),
      );
    };

    loadAdmins();
  }, []);

  const saveAdmins = (updatedAdmins: AdminUser[]) => {
    setAdmins(updatedAdmins);
    localStorage.setItem("adminUsers", JSON.stringify(updatedAdmins));
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const createAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Vérifier si l'email existe déjà
    if (admins.some((admin) => admin.email === newAdmin.email)) {
      alert("Un administrateur avec cette adresse email existe déjà");
      return;
    }

    const admin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password,
      role: newAdmin.role,
      permissions: { ...newAdmin.permissions },
      createdAt: new Date(),
      isActive: true,
    };

    const updatedAdmins = [...admins, admin];
    saveAdmins(updatedAdmins);

    // Reset form
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      role: "admin",
      permissions: { ...defaultPermissions },
    });
    setShowCreateForm(false);
  };

  const updateAdmin = (updatedAdmin: AdminUser) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === updatedAdmin.id ? updatedAdmin : admin,
    );
    saveAdmins(updatedAdmins);
    setEditingAdmin(null);
  };

  const deleteAdmin = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      const updatedAdmins = admins.filter((admin) => admin.id !== id);
      saveAdmins(updatedAdmins);
    }
  };

  const toggleAdminStatus = (id: string) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === id ? { ...admin, isActive: !admin.isActive } : admin,
    );
    saveAdmins(updatedAdmins);
  };

  const permissionLabels = {
    canManageUsers: "Gérer les utilisateurs",
    canManageContent: "Gérer le contenu",
    canManageDesign: "Gérer le design",
    canViewStats: "Voir les statistiques",
    canManageQuotes: "Gérer les devis",
    canAccessSettings: "Accéder aux paramètres",
    canManageStyles: "Gérer les styles avancés",
  };

  const togglePassword = (adminId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Users size={24} className="text-primary" />
            <span>Gestion des Administrateurs</span>
          </h2>
          <p className="text-gray-600">
            Créez et gérez les comptes administrateur avec des permissions
            personnalisées
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          <span>Nouvel Admin</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {admins.length}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-sm font-medium text-green-900">Actifs</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {admins.filter((admin) => admin.isActive).length}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={20} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              Super Admins
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {admins.filter((admin) => admin.role === "super_admin").length}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Admins</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {admins.filter((admin) => admin.role === "admin").length}
          </div>
        </div>
      </div>

      {/* Liste des administrateurs */}
      <div className="space-y-4">
        {admins.map((admin) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white border rounded-lg p-6 ${admin.isActive ? "border-gray-200" : "border-red-200 bg-red-50"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`p-2 rounded-full ${admin.role === "super_admin" ? "bg-purple-100" : "bg-blue-100"}`}
                  >
                    {admin.role === "super_admin" ? (
                      <ShieldCheck size={20} className="text-purple-600" />
                    ) : (
                      <Shield size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{admin.name}</h3>
                    <p className="text-gray-600">{admin.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {admin.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Informations</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>
                          Créé le {admin.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      {admin.lastLogin && (
                        <div className="flex items-center space-x-2">
                          <Clock size={14} />
                          <span>
                            Dernière connexion:{" "}
                            {admin.lastLogin.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Key size={14} />
                        <span className="font-mono">
                          {showPassword[admin.id]
                            ? admin.password
                            : "•".repeat(admin.password.length)}
                        </span>
                        <button
                          onClick={() => togglePassword(admin.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword[admin.id] ? (
                            <EyeOff size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Permissions</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(admin.permissions).map(
                        ([key, value]) =>
                          value && (
                            <span
                              key={key}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              {
                                permissionLabels[
                                  key as keyof typeof permissionLabels
                                ]
                              }
                            </span>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleAdminStatus(admin.id)}
                  className={`p-2 rounded transition-colors ${
                    admin.isActive
                      ? "text-red-600 hover:bg-red-100"
                      : "text-green-600 hover:bg-green-100"
                  }`}
                  title={admin.isActive ? "Désactiver" : "Activer"}
                >
                  {admin.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <button
                  onClick={() => setEditingAdmin(admin)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  title="Modifier"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => deleteAdmin(admin.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {admins.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun administrateur
            </h3>
            <p className="text-gray-600">
              Créez votre premier compte administrateur
            </p>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Créer un nouvel administrateur
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Mot de passe sécurisé"
                    />
                    <button
                      onClick={() =>
                        setNewAdmin({
                          ...newAdmin,
                          password: generatePassword(),
                        })
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Générer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({
                        ...newAdmin,
                        role: e.target.value as "admin" | "super_admin",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="super_admin">Super Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={
                            newAdmin.permissions[
                              key as keyof typeof newAdmin.permissions
                            ]
                          }
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              permissions: {
                                ...newAdmin.permissions,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createAdmin}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save size={16} />
                    <span>Créer l'administrateur</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Modifier l'administrateur</h3>
                <button
                  onClick={() => setEditingAdmin(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={editingAdmin.name}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingAdmin.email}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingAdmin.password}
                      onChange={(e) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          password: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() =>
                        setEditingAdmin({
                          ...editingAdmin,
                          password: generatePassword(),
                        })
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Régénérer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={
                            editingAdmin.permissions[
                              key as keyof typeof editingAdmin.permissions
                            ]
                          }
                          onChange={(e) =>
                            setEditingAdmin({
                              ...editingAdmin,
                              permissions: {
                                ...editingAdmin.permissions,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setEditingAdmin(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => updateAdmin(editingAdmin)}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save size={16} />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
