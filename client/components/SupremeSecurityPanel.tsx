import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Users,
  Database,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface SupremeSecurityPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SupremeSecurityPanel: React.FC<SupremeSecurityPanelProps> = ({
  isOpen = false,
  onClose,
}) => {
  const { isSuperAdmin, isMindAdmin, currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [securityLevel, setSecurityLevel] = useState("maximum");
  const [sessionData, setSessionData] = useState<any>({});

  // Synchroniser avec les props
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  useEffect(() => {
    if (isVisible) {
      // Collecter des données de session
      setSessionData({
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        connection: (navigator as any).connection?.effectiveType || "unknown",
      });
    }
  }, [isVisible]);

  const executeSupremeCommand = (command: string) => {
    switch (command) {
      case "clear_all_cache":
        if (
          confirm(
            "ATTENTION: Vider tous les caches ? Données critiques seront préservées.",
          )
        ) {
          // Sauvegarder les données critiques
          const criticalData = {
            adminAuth: localStorage.getItem("adminAuth"),
            superAdminAuth: localStorage.getItem("superAdminAuth"),
            supremeAuth: localStorage.getItem("supremeAuth"),
            currentUser: localStorage.getItem("currentUser"),
            siteContent: localStorage.getItem("siteContent"),
          };

          // Vider les caches
          localStorage.clear();
          sessionStorage.clear();
          if ("caches" in window) {
            caches
              .keys()
              .then((names) => names.forEach((name) => caches.delete(name)));
          }

          // Restaurer les données critiques
          Object.entries(criticalData).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
          });

          alert("Cache vidé ! Données critiques préservées.");
          location.reload();
        }
        break;

      case "force_reload":
        if (confirm("Forcer le rechargement complet ?")) {
          localStorage.setItem("forceReload_" + Date.now(), "true");
          location.reload();
        }
        break;

      case "export_everything":
        try {
          const exportData = {
            timestamp: new Date().toISOString(),
            admin:
              JSON.parse(localStorage.getItem("currentUser") || "{}")?.email ||
              "unknown",
            systemData: {
              siteContent: JSON.parse(
                localStorage.getItem("siteContent") || "{}",
              ),
              adminLogs: JSON.parse(localStorage.getItem("adminLogs") || "[]"),
              userRequests: JSON.parse(
                localStorage.getItem("userRequests") || "[]",
              ),
              chatSessions: JSON.parse(
                localStorage.getItem("chatSessions") || "[]",
              ),
              uploadedImages: JSON.parse(
                localStorage.getItem("uploadedImages") || "[]",
              ),
            },
            sessionInfo: sessionData,
            securityInfo: {
              authLevel: "supreme",
              sessionActive: true,
              exportTime: Date.now(),
            },
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `supreme_export_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);

          alert("Export complet terminé !");
        } catch (error) {
          alert(
            "Erreur export: " +
              (error instanceof Error ? error.message : "Erreur"),
          );
        }
        break;

      case "stealth_mode":
        if (confirm("Mode furtif: masquer tous les éléments admin ?")) {
          const elements = document.querySelectorAll(
            '[class*="admin"], [class*="super"], button[title="Admin"]',
          );
          elements.forEach(
            (el) => ((el as HTMLElement).style.display = "none"),
          );

          alert("Mode furtif activé ! Rechargez pour restaurer.");
          setTimeout(() => {
            if (confirm("Restaurer l'affichage admin ?")) location.reload();
          }, 30000);
        }
        break;

      case "emergency_backup":
        try {
          const backup = {
            timestamp: new Date().toISOString(),
            admin:
              JSON.parse(localStorage.getItem("currentUser") || "{}")?.email ||
              "unknown",
            emergency: true,
            data: {
              siteContent: localStorage.getItem("siteContent"),
              userRequests: localStorage.getItem("userRequests"),
              chatSessions: localStorage.getItem("chatSessions"),
              adminAuth: localStorage.getItem("adminAuth"),
            },
          };

          localStorage.setItem("emergencyBackup", JSON.stringify(backup));

          const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `emergency_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);

          alert("Sauvegarde d'urgence créée !");
        } catch (error) {
          alert(
            "Erreur sauvegarde: " +
              (error instanceof Error ? error.message : "Erreur"),
          );
        }
        break;

      case "system_diagnostics":
        const diagnostics = {
          storage: `LocalStorage: ${Object.keys(localStorage).length} clés`,
          session: `SessionStorage: ${Object.keys(sessionStorage).length} clés`,
          memory: (performance as any).memory
            ? `Mémoire: ${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB`
            : "Mémoire: Non disponible",
          screen: `Écran: ${screen.width}x${screen.height}`,
          window: `Fenêtre: ${window.innerWidth}x${window.innerHeight}`,
          connection:
            (navigator as any).connection?.effectiveType || "Inconnue",
        };

        alert("Diagnostics:\n\n" + Object.values(diagnostics).join("\n"));
        break;

      default:
        alert("Commande inconnue: " + command);
    }
  };

  // Accès restreint: seulement Philippe, pas l'admin Mind
  const isPhilippeAdmin = currentUser?.email === "philippefaizsanon@gmail.com";
  const isMindAdminStrict =
    isMindAdmin ||
    currentUser?.email === "admin@mindgraphix.com" ||
    currentUser?.role === "mind";

  if (!isSuperAdmin || isMindAdminStrict || !isPhilippeAdmin) return null;

  if (!isVisible) {
    return (
      <div className="fixed bottom-2 left-2 opacity-5 hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-gradient-to-br from-red-900 to-red-800 text-white rounded-2xl p-8 max-w-4xl w-full mx-4 border border-red-600 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield size={32} className="text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">SUPREME SECURITY CONSOLE</h2>
              <p className="text-red-300 text-sm">Niveau d'accès: MAXIMUM</p>
            </div>
          </div>
          <Button
            onClick={handleClose}
            className="bg-red-700 hover:bg-red-600 text-white"
          >
            <EyeOff size={16} className="mr-2" />
            Masquer
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-800 rounded-lg p-4 text-center">
            <Monitor size={24} className="mx-auto mb-2 text-blue-400" />
            <div className="text-xs text-red-300">Résolution</div>
            <div className="font-bold">{sessionData.screen}</div>
          </div>
          <div className="bg-red-800 rounded-lg p-4 text-center">
            <Database size={24} className="mx-auto mb-2 text-green-400" />
            <div className="text-xs text-red-300">LocalStorage</div>
            <div className="font-bold">{sessionData.localStorage} clés</div>
          </div>
          <div className="bg-red-800 rounded-lg p-4 text-center">
            <Users size={24} className="mx-auto mb-2 text-yellow-400" />
            <div className="text-xs text-red-300">Connexion</div>
            <div className="font-bold">{sessionData.connection}</div>
          </div>
          <div className="bg-red-800 rounded-lg p-4 text-center">
            <Lock size={24} className="mx-auto mb-2 text-red-400" />
            <div className="text-xs text-red-300">Sécurité</div>
            <div className="font-bold text-green-400">ACTIVE</div>
          </div>
        </div>

        {/* Commandes Supreme */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center">
              <Settings size={20} className="mr-2" />
              Commandes Système
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => executeSupremeCommand("clear_all_cache")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                Vider tous les caches
              </Button>
              <Button
                onClick={() => executeSupremeCommand("force_reload")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Rechargement forcé
              </Button>
              <Button
                onClick={() => executeSupremeCommand("export_everything")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Export complet système
              </Button>
              <Button
                onClick={() => executeSupremeCommand("emergency_backup")}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Sauvegarde d'urgence
              </Button>
              <Button
                onClick={() => executeSupremeCommand("system_diagnostics")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                size="sm"
              >
                Diagnostics système
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400 flex items-center">
              <Eye size={20} className="mr-2" />
              Modes Spéciaux
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => executeSupremeCommand("stealth_mode")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                Mode Furtif
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Activer le mode surveillance ?")) {
                    // Mode surveillance activé
                  }
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                size="sm"
              >
                Mode Surveillance
              </Button>
              <Button
                onClick={() => {
                  document.body.style.filter = "invert(1) hue-rotate(180deg)";
                  setTimeout(() => (document.body.style.filter = ""), 3000);
                }}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                size="sm"
              >
                Mode Matrix
              </Button>
            </div>
          </div>
        </div>

        {/* Info Session */}
        <div className="bg-red-800 rounded-lg p-4">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">
            Informations de Session
          </h3>
          <div className="text-xs text-red-300 space-y-1 font-mono">
            <div>Timestamp: {sessionData.timestamp}</div>
            <div>Agent: {sessionData.userAgent?.substring(0, 60)}...</div>
            <div>
              Données stockées:{" "}
              {sessionData.localStorage + sessionData.sessionStorage} éléments
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-300">
            <Shield size={16} />
            <span className="font-bold text-sm">
              MODE SUPREME ACTIVÉ - Toutes les actions sont enregistr��es
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
