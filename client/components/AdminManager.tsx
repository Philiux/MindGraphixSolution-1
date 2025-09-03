import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit,
  Save,
  X,
  Key,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { PhoneInput } from "./PhoneInput";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  role: "admin" | "supreme" | "mind" | "moderator" | "editor";
  permissions: string[];
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  lastActive?: string;
  department?: string;
}

interface RolePermissions {
  [key: string]: {
    label: string;
    permissions: string[];
    description: string;
  };
}

// Système d'administration sécurisé - Administrateurs par défaut RESTAURÉS
const getSecureAdmins = (): AdminUser[] => {
  return [
    {
      id: "philippe-admin",
      name: "Philippe Faiz Sanon",
      email: "philippefaizsanon@gmail.com",
      phone: "+226 54191605",
      password: "Philius24648",
      securityQuestion: "Quel est votre anime préféré ?",
      securityAnswer: "Bible Black",
      role: "supreme",
      permissions: ["all"],
      createdAt: "2024-01-01",
      createdBy: "system",
      isActive: true,
    },
    {
      id: "mindgraphix-admin",
      name: "Mind Graphix Solution",
      email: "mindgraphixsolution@gmail.com",
      phone: "+226 70123456",
      password: "Mind2024@",
      securityQuestion: "Qui est le plus bête dans l'équipe ?",
      securityAnswer: "Badiori",
      role: "supreme",
      permissions: ["all"],
      createdAt: "2024-01-01",
      createdBy: "system",
      isActive: true,
    },
    {
      id: "mind-admin",
      name: "Mind Administrateur",
      email: "admin@mindgraphix.com",
      phone: "+226 70123456",
      password: "admin123",
      securityQuestion: "Question de sécurité simple",
      securityAnswer: "test",
      role: "mind",
      permissions: ["content", "analytics", "messages"],
      createdAt: "2024-01-01",
      createdBy: "system",
      isActive: true,
    },
  ];
};

interface AdminManagerProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const AdminManager: React.FC<AdminManagerProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}) => {
  const { isSuperAdmin, isMindAdmin, currentUser, getContent, updateContent } =
    useAuth();

  // Configuration des rôles et permissions
  const rolePermissions: RolePermissions = {
    supreme: {
      label: "Administrateur Suprême",
      description: "Accès complet au système, gestion des administrateurs",
      permissions: [
        "FULL_ACCESS",
        "ADMIN_MANAGEMENT",
        "CONTENT_MANAGEMENT",
        "USER_MANAGEMENT",
        "SYSTEM_CONFIG",
        "SECURITY_PANEL",
        "ANALYTICS_FULL",
        "BACKUP_RESTORE",
      ],
    },
    admin: {
      label: "Administrateur",
      description: "Gestion du contenu et des utilisateurs",
      permissions: [
        "CONTENT_MANAGEMENT",
        "USER_MANAGEMENT",
        "ANALYTICS_VIEW",
        "REQUESTS_MANAGEMENT",
        "CHAT_MANAGEMENT",
      ],
    },
    moderator: {
      label: "Modérateur",
      description: "Modération du contenu et support client",
      permissions: [
        "CONTENT_VIEW",
        "CONTENT_EDIT",
        "REQUESTS_VIEW",
        "CHAT_MANAGEMENT",
        "USER_SUPPORT",
      ],
    },
    editor: {
      label: "Éditeur",
      description: "Modification du contenu du site uniquement",
      permissions: ["CONTENT_VIEW", "CONTENT_EDIT", "IMAGE_UPLOAD"],
    },
    mind: {
      label: "Mind Admin",
      description: "Accès limité spécifique Mind Graphix",
      permissions: ["CONTENT_VIEW", "REQUESTS_VIEW", "ANALYTICS_LIMITED"],
    },
  };
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;
  const [admins, setAdmins] = useState<AdminUser[]>(getSecureAdmins());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const savedAdmins = getContent("system.admins", null);
    if (savedAdmins) {
      // Fusionner avec les admins par défaut pour s'assurer qu'ils sont toujours présents
      const mergedAdmins = [...getSecureAdmins()];
      savedAdmins.forEach((savedAdmin: AdminUser) => {
        const existingIndex = mergedAdmins.findIndex(
          (admin) => admin.id === savedAdmin.id,
        );
        if (existingIndex >= 0) {
          mergedAdmins[existingIndex] = savedAdmin;
        } else {
          mergedAdmins.push(savedAdmin);
        }
      });
      setAdmins(mergedAdmins);
    }
  }, []);

  // Accès restreint: seulement les Super Admins
  const isAuthorizedSuperAdmin = isSuperAdmin && !isMindAdmin;
  const isMindAdminStrict = isMindAdmin || currentUser?.role === "mind";

  if (!isAuthorizedSuperAdmin) return null;

  const saveAdmin = () => {
    if (!editForm) return;

    let updatedAdmins;
    if (isCreating) {
      updatedAdmins = [...admins, { ...editForm, id: `admin-${Date.now()}` }];
      setIsCreating(false);
    } else {
      updatedAdmins = admins.map((admin) =>
        admin.id === editForm.id ? editForm : admin,
      );
    }

    setAdmins(updatedAdmins);
    updateContent("system.admins", updatedAdmins);
    setEditingId(null);
    setEditForm(null);
  };

  const startEditing = (admin: AdminUser) => {
    setEditingId(admin.id);
    setEditForm({ ...admin });
    setIsCreating(false);
  };

  const startCreating = () => {
    const newAdmin: AdminUser = {
      id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
      role: "admin",
      permissions: rolePermissions.admin.permissions,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: currentUser?.email || "supreme",
      isActive: true,
      department: "",
    };

    setEditForm(newAdmin);
    setEditingId("new");
    setIsCreating(true);
  };

  const handleRoleChange = (newRole: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        role: newRole as AdminUser["role"],
        permissions: rolePermissions[newRole]?.permissions || [],
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setIsCreating(false);
  };

  const toggleAdminStatus = (id: string) => {
    if (["default-admin", "super-admin"].includes(id)) {
      alert("Impossible de désactiver les administrateurs système.");
      return;
    }

    const updatedAdmins = admins.map((admin) =>
      admin.id === id ? { ...admin, isActive: !admin.isActive } : admin,
    );
    setAdmins(updatedAdmins);
    updateContent("system.admins", updatedAdmins);
  };

  const deleteAdmin = (id: string) => {
    if (["default-admin", "super-admin"].includes(id)) {
      alert("Impossible de supprimer les administrateurs système.");
      return;
    }

    if (confirm("Supprimer définitivement cet administrateur ?")) {
      const updatedAdmins = admins.filter((admin) => admin.id !== id);
      setAdmins(updatedAdmins);
      updateContent("system.admins", updatedAdmins);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const password = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    if (editForm) {
      setEditForm({ ...editForm, password });
    }
  };

  return (
    <>
      {/* Admin Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users size={24} />
                  <h2 className="text-2xl font-bold">
                    Gestionnaire d'Administrateurs
                  </h2>
                  <span className="px-2 py-1 bg-purple-800 rounded-full text-xs font-bold">
                    ACCÈS SUPREME UNIQUEMENT
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-purple-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gestion des Comptes Administrateurs ({admins.length})
                </h3>
                <Button
                  onClick={startCreating}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <UserPlus size={16} className="mr-2" />
                  Créer Administrateur
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              {/* Guide des rôles */}
              {!editingId && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Guide des Rôles et Permissions
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(rolePermissions).map(
                      ([roleKey, roleInfo]) => (
                        <div
                          key={roleKey}
                          className="bg-white border border-blue-200 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                roleKey === "supreme"
                                  ? "bg-red-100 text-red-800"
                                  : roleKey === "mind"
                                    ? "bg-green-100 text-green-800"
                                    : roleKey === "moderator"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : roleKey === "editor"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {roleInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {roleInfo.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Permissions :</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {roleInfo.permissions
                                .slice(0, 2)
                                .map((permission) => (
                                  <span
                                    key={permission}
                                    className="bg-gray-100 px-1 py-0.5 rounded"
                                  >
                                    {permission.replace("_", " ")}
                                  </span>
                                ))}
                              {roleInfo.permissions.length > 2 && (
                                <span className="text-gray-400">
                                  +{roleInfo.permissions.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {editingId && editForm ? (
                /* Mode édition/création */
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {isCreating
                        ? "Créer un Nouvel Administrateur"
                        : `Modifier : ${editForm.name}`}
                    </h4>
                    <div className="flex space-x-2">
                      <Button
                        onClick={saveAdmin}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={
                          !editForm.name ||
                          !editForm.email ||
                          !editForm.password
                        }
                      >
                        <Save size={16} className="mr-1" />
                        {isCreating ? "Créer" : "Sauvegarder"}
                      </Button>
                      <Button onClick={cancelEditing} variant="outline">
                        <X size={16} className="mr-1" />
                        Annuler
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Nom de l'administrateur"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <PhoneInput
                          value={editForm.phone}
                          onChange={(value) =>
                            setEditForm({ ...editForm, phone: value })
                          }
                          placeholder="XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle et Permissions
                        </label>
                        <select
                          value={editForm.role}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          disabled={editForm.id === "supreme-admin"}
                        >
                          {Object.entries(rolePermissions).map(
                            ([roleKey, roleInfo]) => (
                              <option key={roleKey} value={roleKey}>
                                {roleInfo.label}
                              </option>
                            ),
                          )}
                        </select>
                        {editForm.role && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                              {rolePermissions[editForm.role]?.description}
                            </p>
                            <div className="text-xs text-gray-500">
                              <strong>Permissions :</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(editForm.permissions || []).map(
                                  (permission) => (
                                    <span
                                      key={permission}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                    >
                                      {permission.replace("_", " ")}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Département (optionnel)
                        </label>
                        <select
                          value={editForm.department || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Aucun département</option>
                          <option value="design">Design Graphique</option>
                          <option value="web">Développement Web</option>
                          <option value="mobile">Applications Mobiles</option>
                          <option value="marketing">Marketing Digital</option>
                          <option value="support">Support Client</option>
                          <option value="sales">Commercial</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de Passe *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                password: e.target.value,
                              })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Mot de passe sécurisé"
                          />
                          <Button
                            onClick={generatePassword}
                            size="sm"
                            variant="outline"
                            title="Générer un mot de passe"
                          >
                            <Key size={16} />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question de Sécurité
                        </label>
                        <input
                          type="text"
                          value={editForm.securityQuestion}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              securityQuestion: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="ex: Quel est le nom de votre animal de compagnie ?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Réponse de Sécurité
                        </label>
                        <input
                          type="text"
                          value={editForm.securityAnswer}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              securityAnswer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Réponse à la question de sécurité"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={editForm.isActive}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm font-medium text-gray-700"
                        >
                          Compte actif
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Liste des administrateurs */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Administrateurs Existants
                </h4>

                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className={`border rounded-lg p-4 ${
                      admin.isActive
                        ? "border-gray-200 bg-white"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">
                            {admin.name}
                          </h5>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              admin.role === "supreme"
                                ? "bg-red-100 text-red-800"
                                : admin.role === "mind"
                                  ? "bg-green-100 text-green-800"
                                  : admin.role === "moderator"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : admin.role === "editor"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {rolePermissions[admin.role]?.label.toUpperCase() ||
                              admin.role.toUpperCase()}
                          </span>
                          {!admin.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                              DÉSACTIVÉ
                            </span>
                          )}
                          {admin.id === currentUser?.email && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                              VOUS
                            </span>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {admin.email}
                          </div>
                          <div>
                            <span className="font-medium">Téléphone:</span>{" "}
                            {admin.phone || "Non renseigné"}
                          </div>
                          <div>
                            <span className="font-medium">Créé le:</span>{" "}
                            {admin.createdAt}
                          </div>
                          <div>
                            <span className="font-medium">Département:</span>{" "}
                            {admin.department ? (
                              <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                                {admin.department}
                              </span>
                            ) : (
                              "Non assigné"
                            )}
                          </div>
                        </div>

                        {/* Affichage des permissions */}
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">
                            Permissions :
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(
                              admin.permissions ||
                              rolePermissions[admin.role]?.permissions ||
                              []
                            )
                              .slice(0, 4)
                              .map((permission) => (
                                <span
                                  key={permission}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {permission.replace("_", " ")}
                                </span>
                              ))}
                            {(
                              admin.permissions ||
                              rolePermissions[admin.role]?.permissions ||
                              []
                            ).length > 4 && (
                              <span className="text-gray-500 text-xs px-2 py-1">
                                +
                                {(
                                  admin.permissions ||
                                  rolePermissions[admin.role]?.permissions ||
                                  []
                                ).length - 4}{" "}
                                autres
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          onClick={() => startEditing(admin)}
                          size="sm"
                          variant="outline"
                          title="Modifier"
                          disabled={
                            admin.id === "super-admin" &&
                            admin.email !== currentUser?.email
                          }
                        >
                          <Edit size={16} />
                        </Button>

                        {!["default-admin", "super-admin"].includes(
                          admin.id,
                        ) && (
                          <>
                            <Button
                              onClick={() => toggleAdminStatus(admin.id)}
                              size="sm"
                              variant="outline"
                              className={
                                admin.isActive
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                              title={admin.isActive ? "Désactiver" : "Activer"}
                            >
                              <Shield size={16} />
                            </Button>

                            <Button
                              onClick={() => deleteAdmin(admin.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
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

              {/* Informations importantes */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Informations Importantes
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>
                    • Seuls les Administrateurs Supreme peuvent gérer les
                    comptes administrateurs
                  </li>
                  <li>
                    • Les administrateurs système (par défaut) ne peuvent pas
                    être supprimés
                  </li>
                  <li>
                    • Un administrateur désactivé ne peut plus se connecter
                  </li>
                  <li>
                    • Gardez toujours au moins un Administrateur Supreme actif
                  </li>
                  <li>
                    • Les mots de passe sont stockés en texte clair (pour demo
                    uniquement)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
