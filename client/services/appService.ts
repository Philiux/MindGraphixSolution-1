import { notificationService } from "./notificationService";
import { quoteService } from "./quoteService";

class AppService {
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  // Initialiser l'application
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._performInitialization();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  private async _performInitialization(): Promise<void> {
    try {
      // Initialiser les services
      this._initializeEventListeners();
      this._performMaintenanceTasks();

      console.log("✅ Application initialisée avec succès");

      // En mode développement, lancer les tests automatiques
      if (import.meta.env.DEV) {
        setTimeout(async () => {
          try {
            // Tests de santé du système (priorité haute)
            const { runSystemHealthCheck } = await import(
              "../utils/systemHealthCheck"
            );
            const healthResults = await runSystemHealthCheck();

            // Tests de fonctionnalités (si santé OK)
            if (healthResults.every((r) => r.status === "pass")) {
              const { functionalityTester } = await import(
                "../utils/functionalityTest"
              );
              const results = await functionalityTester.runAllTests();
              console.log("🧪 Tests de fonctionnalités terminés:", results);
            } else {
              console.warn(
                "⚠️ Tests de fonctionnalités sautés - problèmes de santé détectés",
              );
            }
          } catch (error) {
            console.warn("⚠️ Erreur lors des tests automatiques:", error);
          }
        }, 3000);
      }

      // Notification de bienvenue pour les nouveaux utilisateurs
      const isFirstVisit = !localStorage.getItem("app_visited");
      if (isFirstVisit) {
        notificationService.notifySystem(
          "Bienvenue chez Mind Graphix !",
          "Découvrez nos services de développement web et design créatif.",
          "low",
        );
        localStorage.setItem("app_visited", "true");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation:", error);
      throw error;
    }
  }

  // Initialiser les écouteurs d'événements
  private _initializeEventListeners(): void {
    // Écouter les changements de statut de devis
    window.addEventListener("quoteStatusUpdated", (event: CustomEvent) => {
      const { id, status } = event.detail;
      console.log(`📋 Statut de devis mis à jour: ${id} -> ${status}`);
    });

    // Écouter les erreurs globales
    window.addEventListener("error", (event) => {
      console.error("🚨 Erreur globale capturée:", event.error);
      notificationService.notifySystem(
        "Erreur système",
        "Une erreur inattendue s'est produite. Veuillez actualiser la page.",
        "high",
      );
    });

    // Écouter les erreurs de promesses non gérées
    window.addEventListener("unhandledrejection", (event) => {
      console.error("🚨 Promesse rejetée non gérée:", event.reason);
      notificationService.notifySystem(
        "Erreur de traitement",
        "Un problème de traitement s'est produit.",
        "medium",
      );
    });
  }

  // Tâches de maintenance
  private _performMaintenanceTasks(): void {
    // Nettoyer les anciennes données
    this._cleanupOldData();

    // Vérifier l'intégrité des données
    this._checkDataIntegrity();
  }

  // Nettoyer les anciennes données (plus de 30 jours)
  private _cleanupOldData(): void {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Nettoyer les anciennes notifications
      const notifications = notificationService.getNotifications();
      const recentNotifications = notifications.filter(
        (notif) => notif.timestamp > thirtyDaysAgo,
      );

      if (recentNotifications.length !== notifications.length) {
        localStorage.setItem(
          "notifications",
          JSON.stringify(recentNotifications),
        );
        console.log(
          `🧹 ${notifications.length - recentNotifications.length} anciennes notifications supprimées`,
        );
      }

      // Nettoyer les anciens rapports d'erreur
      const errorReports = JSON.parse(
        localStorage.getItem("errorReports") || "[]",
      );
      const recentErrors = errorReports.filter(
        (report: any) => new Date(report.timestamp) > thirtyDaysAgo,
      );

      if (recentErrors.length !== errorReports.length) {
        localStorage.setItem("errorReports", JSON.stringify(recentErrors));
        console.log(
          `🧹 ${errorReports.length - recentErrors.length} anciens rapports d'erreur supprimés`,
        );
      }
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
    }
  }

  // Vérifier l'intégrité des données
  private _checkDataIntegrity(): void {
    try {
      // Vérifier les devis
      const quotes = quoteService.getQuoteRequests();
      let fixedQuotes = 0;

      quotes.forEach((quote) => {
        let needsUpdate = false;

        // Vérifier les champs obligatoires
        if (!quote.id) {
          quote.id =
            Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
          needsUpdate = true;
        }

        if (!quote.createdAt || !(quote.createdAt instanceof Date)) {
          quote.createdAt = new Date();
          needsUpdate = true;
        }

        if (!quote.updatedAt || !(quote.updatedAt instanceof Date)) {
          quote.updatedAt = new Date();
          needsUpdate = true;
        }

        if (needsUpdate) {
          fixedQuotes++;
        }
      });

      if (fixedQuotes > 0) {
        localStorage.setItem("quoteRequests", JSON.stringify(quotes));
        console.log(`🔧 ${fixedQuotes} devis corrigés`);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'intégrité:", error);
    }
  }

  // Obtenir les statistiques de l'application
  getAppStats() {
    const quoteStats = quoteService.getQuoteStats();
    const notificationStats = notificationService.getNotificationStats();

    return {
      quotes: quoteStats,
      notifications: notificationStats,
      storage: this._getStorageStats(),
      performance: this._getPerformanceStats(),
    };
  }

  // Statistiques de stockage
  private _getStorageStats() {
    try {
      let totalSize = 0;
      const storageData: Record<string, number> = {};

      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = localStorage[key].length;
          storageData[key] = size;
          totalSize += size;
        }
      }

      return {
        totalSize,
        totalSizeKB: Math.round(totalSize / 1024),
        breakdown: storageData,
        available: 5 * 1024 * 1024 - totalSize, // Estimation 5MB limite
      };
    } catch (error) {
      return { error: "Impossible de calculer les statistiques de stockage" };
    }
  }

  // Statistiques de performance
  private _getPerformanceStats() {
    try {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      return {
        loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        domContentLoaded: Math.round(
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
        ),
        firstPaint: Math.round(
          navigation.responseStart - navigation.fetchStart,
        ),
        memoryUsage: (performance as any).memory
          ? {
              used: Math.round(
                (performance as any).memory.usedJSHeapSize / 1048576,
              ),
              total: Math.round(
                (performance as any).memory.totalJSHeapSize / 1048576,
              ),
              limit: Math.round(
                (performance as any).memory.jsHeapSizeLimit / 1048576,
              ),
            }
          : null,
      };
    } catch (error) {
      return {
        error: "Impossible de calculer les statistiques de performance",
      };
    }
  }

  // Exporter toutes les données de l'application
  exportAllData() {
    try {
      const data = {
        quotes: quoteService.getQuoteRequests(),
        generatedQuotes: quoteService.getQuotes(),
        notifications: notificationService.getNotifications(),
        userRequests: JSON.parse(localStorage.getItem("userRequests") || "[]"),
        siteContent: JSON.parse(localStorage.getItem("siteContent") || "{}"),
        appSettings: {
          visited: localStorage.getItem("app_visited"),
          lastExport: new Date().toISOString(),
        },
        stats: this.getAppStats(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `mindgraphix_export_${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      return true;
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      return false;
    }
  }

  // Importer des données
  importData(data: any): boolean {
    try {
      if (data.quotes) {
        localStorage.setItem("quoteRequests", JSON.stringify(data.quotes));
      }

      if (data.generatedQuotes) {
        localStorage.setItem("quotes", JSON.stringify(data.generatedQuotes));
      }

      if (data.notifications) {
        localStorage.setItem(
          "notifications",
          JSON.stringify(data.notifications),
        );
      }

      if (data.userRequests) {
        localStorage.setItem("userRequests", JSON.stringify(data.userRequests));
      }

      if (data.siteContent) {
        localStorage.setItem("siteContent", JSON.stringify(data.siteContent));
      }

      console.log("✅ Données importées avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de l'import:", error);
      return false;
    }
  }

  // Réinitialiser l'application
  resetApp(): boolean {
    try {
      const keysToKeep = ["app_visited"]; // Garder certaines préférences
      const keysToRemove: string[] = [];

      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      console.log("🔄 Application réinitialisée");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation:", error);
      return false;
    }
  }

  // Vérifier l'état de l'application
  checkHealth(): { status: "healthy" | "warning" | "error"; issues: string[] } {
    const issues: string[] = [];

    try {
      // Vérifier localStorage
      localStorage.setItem("health_check", "test");
      localStorage.removeItem("health_check");
    } catch (error) {
      issues.push("Problème avec localStorage");
    }

    // Vérifier les services
    try {
      quoteService.getQuoteRequests();
    } catch (error) {
      issues.push("Problème avec le service de devis");
    }

    try {
      notificationService.getNotifications();
    } catch (error) {
      issues.push("Problème avec le service de notifications");
    }

    // Vérifier la mémoire
    const stats = this._getStorageStats();
    if (stats.available && stats.available < 100000) {
      // Moins de 100KB disponible
      issues.push("Espace de stockage faible");
    }

    const status =
      issues.length === 0 ? "healthy" : issues.length < 3 ? "warning" : "error";

    return { status, issues };
  }
}

// Instance singleton
export const appService = new AppService();
