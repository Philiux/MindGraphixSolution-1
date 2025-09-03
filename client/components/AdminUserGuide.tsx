import React, { useState } from "react";
import {
  HelpCircle,
  X,
  User,
  Settings,
  Eye,
  Edit,
  Save,
  Smartphone,
  Monitor,
  Download,
  Upload,
} from "lucide-react";

export const AdminUserGuide: React.FC = () => {
  return null; // Composant désactivé pour sécurité
  const [activeSection, setActiveSection] = useState("intro");
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction", icon: HelpCircle },
    { id: "connection", title: "Connexion Admin", icon: User },
    { id: "interface", title: "Interface Admin", icon: Settings },
    { id: "editing", title: "Édition du Contenu", icon: Edit },
    { id: "preview", title: "Prévisualisation", icon: Eye },
    { id: "advanced", title: "Fonctions Avancées", icon: Save },
  ];

  return (
    <>
      {/* Guide Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-42 left-6 z-50 w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Guide d'administration complet"
      >
        <HelpCircle size={20} />
      </button>

      {/* Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white w-full max-w-6xl mx-auto my-4 rounded-2xl shadow-2xl overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-700 text-white p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Guide Admin</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <section.icon size={18} />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto max-h-[90vh]">
              {activeSection === "intro" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Interface d'Administration Mind Graphix
                  </h3>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-blue-800 mb-4">
                      Bienvenue dans votre tableau de bord !
                    </h4>
                    <p className="text-blue-700 mb-4">
                      Cette interface vous donne un contrôle total sur votre
                      site web. Vous pouvez :
                    </p>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Modifier tous les textes en temps réel</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Personnaliser les couleurs et le design</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Gérer les demandes de devis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Prévisualiser en temps réel</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Switcher entre vue admin et utilisateur</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🎯 Interface Sépar��e
                      </h4>
                      <p className="text-green-700 text-sm">
                        L'interface admin est complètement séparée de celle des
                        utilisateurs pour une gestion optimale.
                      </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">
                        🔄 Switch Instantané
                      </h4>
                      <p className="text-orange-700 text-sm">
                        Passez instantanément entre la vue admin et la vue
                        utilisateur avec le bouton de switch.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "connection" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Connexion Administrateur
                  </h3>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-red-800 mb-4">
                      Identifiants Administrateur
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <strong className="text-red-700">Email:</strong>
                          <code className="bg-red-100 px-2 py-1 rounded">
                            philippefaizsanon@gmail.com
                          </code>
                        </div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-red-700">
                            Mot de passe:
                          </strong>
                          <code className="bg-red-100 px-2 py-1 rounded">
                            MINDSETGrapix2025
                          </code>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <strong className="text-red-700">Téléphone:</strong>
                          <code className="bg-red-100 px-2 py-1 rounded">
                            +226 54191605
                          </code>
                        </div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-red-700">
                            Question sécurité:
                          </strong>
                          <code className="bg-red-100 px-2 py-1 rounded">
                            [Confidentielle]
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      Processus de Connexion
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold">
                            Cliquer sur "Connexion"
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Dans le header du site, cliquez sur le bouton
                            "Connexion"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold">
                            Entrer Email + Mot de passe
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Saisissez l'email admin et le mot de passe. Le
                            système détecte automatiquement les identifiants
                            admin.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h5 className="font-semibold">
                            Authentification avancée
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Le système demande alors le téléphone et la réponse
                            à la question de sécurité.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          4
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-800">
                            Redirection automatique
                          </h5>
                          <p className="text-green-700 text-sm">
                            Une fois connecté, redirection automatique vers le
                            tableau de bord admin.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "interface" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Interface d'Administration
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <Monitor className="mr-2" size={18} />
                        Barre Supérieure
                      </h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Logo et titre</li>
                        <li>• Modes d'aperçu (Desktop/Tablet/Mobile)</li>
                        <li>
                          • Boutons d'action (Voir, Appliquer, Déconnexion)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <Settings className="mr-2" size={18} />
                        Menu Latéral
                      </h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Vue d'ensemble</li>
                        <li>• Gestion du contenu</li>
                        <li>• Personnalisation design</li>
                        <li>• Messages & demandes</li>
                        <li>• Paramètres avancés</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <Eye className="mr-2" size={18} />
                        Zone Principale
                      </h4>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Panneau d'édition</li>
                        <li>• Aperçu en temps réel</li>
                        <li>• Preview responsive</li>
                        <li>• Outils de navigation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-yellow-800 mb-4">
                      🔄 Switch Vue Admin/Utilisateur
                    </h4>
                    <p className="text-yellow-700 mb-4">
                      Le bouton de switch en haut à gauche vous permet de passer
                      instantanément entre :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-red-600 mb-2">
                          🔧 Mode Admin
                        </h5>
                        <p className="text-sm text-gray-600">
                          Interface complète d'administration avec tous les
                          outils de gestion et modification.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-green-600 mb-2">
                          👁️ Mode Utilisateur
                        </h5>
                        <p className="text-sm text-gray-600">
                          Vue normale du site comme la voient vos visiteurs,
                          avec outils admin discrets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "editing" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Édition du Contenu
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-blue-800 mb-4">
                        📝 Édition via Panneau
                      </h4>
                      <p className="text-blue-700 mb-4">
                        Dans l'onglet "Contenu" du tableau de bord :
                      </p>
                      <ul className="space-y-2 text-blue-700 text-sm">
                        <li>
                          • Tous les textes du site organis��s par sections
                        </li>
                        <li>• Modification instantanée des champs</li>
                        <li>• Sauvegarde automatique</li>
                        <li>• Aperçu en temps réel</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-green-800 mb-4">
                        ✏️ Édition Visuelle
                      </h4>
                      <p className="text-green-700 mb-4">
                        En mode utilisateur avec outils admin :
                      </p>
                      <ul className="space-y-2 text-green-700 text-sm">
                        <li>• Clic direct sur les textes éditables</li>
                        <li>• Surbrillance au survol</li>
                        <li>• Raccourcis clavier (Enter, Escape)</li>
                        <li>• Modification contextuelle</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      Sections Éditables
                    </h4>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold mb-2">🏠 Hero Section</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Titre principal</li>
                          <li>• Sous-titre</li>
                          <li>• Textes des boutons</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold mb-2">ℹ️ À Propos</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Titre de section</li>
                          <li>• Descriptions</li>
                          <li>• Textes explicatifs</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold mb-2">🛠️ Services</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Titres services</li>
                          <li>• Descriptions</li>
                          <li>• Sous-titres</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold mb-2">📞 Contact</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Informations société</li>
                          <li>• Téléphone/Email</li>
                          <li>• Adresse</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "preview" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Prévisualisation & Design
                  </h3>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4">
                      🎨 Personnalisation du Design
                    </h4>
                    <p className="text-purple-700 mb-4">
                      L'onglet "Design" vous permet de personnaliser entièrement
                      l'apparence :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-600 mb-2">
                          🎨 Couleurs
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Couleur primaire</li>
                          <li>• Couleur secondaire</li>
                          <li>• Couleur accent</li>
                          <li>• Arrière-plan</li>
                          <li>• Texte principal</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-600 mb-2">
                          📱 Responsive
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Vue Desktop</li>
                          <li>• Vue Tablet</li>
                          <li>• Vue Mobile</li>
                          <li>• Test adaptatif</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-600 mb-2">
                          👀 Aperçu
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Temps réel</li>
                          <li>• Multi-formats</li>
                          <li>• Navigation</li>
                          <li>• Actualisation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        📱 Modes d'Aperçu
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Monitor className="text-blue-500" size={20} />
                          <div>
                            <h5 className="font-semibold">Desktop</h5>
                            <p className="text-sm text-gray-600">
                              Vue complète sur écran large
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Monitor className="text-green-500" size={18} />
                          <div>
                            <h5 className="font-semibold">Tablet</h5>
                            <p className="text-sm text-gray-600">
                              768px × 1024px
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Smartphone className="text-orange-500" size={16} />
                          <div>
                            <h5 className="font-semibold">Mobile</h5>
                            <p className="text-sm text-gray-600">
                              375px × 667px
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        🔧 Outils d'Aperçu
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Eye className="text-blue-500" size={20} />
                          <div>
                            <h5 className="font-semibold">Actualisation</h5>
                            <p className="text-sm text-gray-600">
                              Rechargement en un clic
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <Monitor className="text-green-500" size={20} />
                          <div>
                            <h5 className="font-semibold">Nouvel onglet</h5>
                            <p className="text-sm text-gray-600">
                              Ouverture externe
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "advanced" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Fonctions Avancées
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                        <Save className="mr-2" size={20} />
                        Sauvegarde
                      </h4>
                      <ul className="space-y-2 text-green-700 text-sm">
                        <li>
                          • <strong>Automatique :</strong> Toutes les 5 secondes
                        </li>
                        <li>
                          • <strong>Manuelle :</strong> Bouton de sauvegarde
                        </li>
                        <li>
                          • <strong>Locale :</strong> Stockage navigateur
                        </li>
                        <li>
                          • <strong>Persistante :</strong> Conservation entre
                          sessions
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <Download className="mr-2" size={20} />
                        Export/Import
                      </h4>
                      <ul className="space-y-2 text-blue-700 text-sm">
                        <li>
                          • <strong>Export :</strong> Téléchargement JSON
                        </li>
                        <li>
                          • <strong>Import :</strong> Chargement depuis fichier
                        </li>
                        <li>
                          • <strong>Backup :</strong> Sauvegarde de sécurité
                        </li>
                        <li>
                          • <strong>Restauration :</strong> Récupération rapide
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-orange-800 mb-4">
                      📧 Gestion des Messages
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-600 mb-2">
                          📨 Réception
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Notifications temps réel</li>
                          <li>• Stockage local</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-600 mb-2">
                          👀 Consultation
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>��� Détails complets</li>
                          <li>• Informations client</li>
                          <li>• Description projet</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-600 mb-2">
                          ✉️ Réponse
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Email direct</li>
                          <li>• Appel téléphonique</li>
                          <li>• Modèles pré-remplis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-red-800 mb-4">
                      ⚠️ Actions Critiques
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          !
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-700">
                            Réinitialisation du contenu
                          </h5>
                          <p className="text-red-600 text-sm">
                            Supprime toutes les modifications et revient aux
                            valeurs par défaut. Action irréversible.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          !
                        </div>
                        <div>
                          <h5 className="font-semibold text-orange-700">
                            Rechargement de page
                          </h5>
                          <p className="text-orange-600 text-sm">
                            Nécessaire pour appliquer certains changements
                            (couleurs). Sauvegarde automatique.
                          </p>
                        </div>
                      </div>
                    </div>
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
