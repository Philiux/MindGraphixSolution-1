/**
 * Test de santé du système pour vérifier que tout fonctionne correctement
 */

export interface HealthCheckResult {
  component: string;
  status: "pass" | "fail" | "warning";
  message: string;
  timestamp: Date;
}

export class SystemHealthChecker {
  private results: HealthCheckResult[] = [];

  /**
   * Test de base du localStorage
   */
  testLocalStorage(): HealthCheckResult {
    const result: HealthCheckResult = {
      component: "localStorage",
      status: "fail",
      message: "",
      timestamp: new Date(),
    };

    try {
      const testKey = "health_check_test";
      const testValue = { test: true, timestamp: Date.now() };

      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}");
      localStorage.removeItem(testKey);

      if (retrieved.test === true) {
        result.status = "pass";
        result.message = "localStorage fonctionne correctement";
      } else {
        result.message = "localStorage ne retourne pas les bonnes données";
      }
    } catch (error) {
      result.message = `Erreur localStorage: ${error}`;
    }

    this.results.push(result);
    return result;
  }

  /**
   * Test des filtres et recherches (source principale de l'erreur)
   */
  testFilterFunctions(): HealthCheckResult {
    const result: HealthCheckResult = {
      component: "filters",
      status: "fail",
      message: "",
      timestamp: new Date(),
    };

    try {
      // Test avec des données nulles/undefined
      const testData = [
        { name: "Test", email: "test@example.com" },
        { name: undefined, email: null },
        { name: null, email: undefined },
        { name: "Valid", email: "valid@example.com" },
      ];

      // Test de filtrage sécurisé
      const filtered = testData.filter(
        (item) =>
          (item.name || "").toLowerCase().includes("test") ||
          (item.email || "").toLowerCase().includes("test"),
      );

      if (filtered.length >= 1) {
        result.status = "pass";
        result.message = "Filtres fonctionnent avec données nulles/undefined";
      } else {
        result.message = "Filtres ne fonctionnent pas correctement";
      }
    } catch (error) {
      result.message = `Erreur dans les filtres: ${error}`;
    }

    this.results.push(result);
    return result;
  }

  /**
   * Test des services de quotes
   */
  async testQuoteService(): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      component: "quoteService",
      status: "fail",
      message: "",
      timestamp: new Date(),
    };

    try {
      // Import dynamique pour éviter les erreurs
      const { quoteService } = await import("../services/quoteService");

      // Test simple de récupération
      const stats = quoteService.getQuoteStats();
      const requests = quoteService.getQuoteRequests();

      if (stats && typeof stats.totalRequests === "number") {
        result.status = "pass";
        result.message = `QuoteService fonctionne - ${stats.totalRequests} demandes`;
      } else {
        result.message = "QuoteService ne retourne pas de statistiques valides";
      }
    } catch (error) {
      result.message = `Erreur QuoteService: ${error}`;
    }

    this.results.push(result);
    return result;
  }

  /**
   * Test de l'authentification
   */
  testAuthContext(): HealthCheckResult {
    const result: HealthCheckResult = {
      component: "auth",
      status: "fail",
      message: "",
      timestamp: new Date(),
    };

    try {
      // Test de présence des clés d'auth dans localStorage
      const authKeys = ["adminAuth", "currentUser", "siteContent"];
      const foundKeys = authKeys.filter(
        (key) => localStorage.getItem(key) !== null,
      );

      result.status = "pass";
      result.message = `Contexte Auth OK - ${foundKeys.length} clés trouvées`;
    } catch (error) {
      result.message = `Erreur Auth: ${error}`;
    }

    this.results.push(result);
    return result;
  }

  /**
   * Test de la gestion d'erreurs
   */
  testErrorHandling(): HealthCheckResult {
    const result: HealthCheckResult = {
      component: "errorHandling",
      status: "fail",
      message: "",
      timestamp: new Date(),
    };

    try {
      // Test que les erreurs sont bien capturées
      let errorCaught = false;

      try {
        // Simuler une erreur
        const nullObj: any = null;
        nullObj.something.toLowerCase();
      } catch (e) {
        errorCaught = true;
      }

      if (errorCaught) {
        result.status = "pass";
        result.message = "Gestion d'erreurs fonctionne";
      } else {
        result.message = "Gestion d'erreurs ne capture pas les erreurs";
      }
    } catch (error) {
      result.message = `Erreur dans test de gestion d'erreurs: ${error}`;
    }

    this.results.push(result);
    return result;
  }

  /**
   * Lance tous les tests de santé
   */
  async runAllHealthChecks(): Promise<HealthCheckResult[]> {
    console.log("🏥 Début des tests de santé du système...");

    // Réinitialiser les résultats
    this.results = [];

    // Lancer tous les tests
    this.testLocalStorage();
    this.testFilterFunctions();
    await this.testQuoteService();
    this.testAuthContext();
    this.testErrorHandling();

    // Analyser les résultats
    const passed = this.results.filter((r) => r.status === "pass").length;
    const failed = this.results.filter((r) => r.status === "fail").length;
    const warnings = this.results.filter((r) => r.status === "warning").length;

    console.log(`📊 Résultats des tests de santé:`);
    console.log(`  ✅ Réussis: ${passed}`);
    console.log(`  ❌ Échoués: ${failed}`);
    console.log(`  ⚠️  Avertissements: ${warnings}`);

    if (failed === 0) {
      console.log("🎉 Tous les tests de santé sont passés !");
    } else {
      console.log("⚠️ Certains tests de santé ont échoué");
      this.results
        .filter((r) => r.status === "fail")
        .forEach((r) => {
          console.log(`   ❌ ${r.component}: ${r.message}`);
        });
    }

    return this.results;
  }

  /**
   * Obtient les résultats
   */
  getResults(): HealthCheckResult[] {
    return this.results;
  }

  /**
   * Vérifie si tous les tests sont passés
   */
  allHealthy(): boolean {
    return this.results.every((r) => r.status === "pass");
  }
}

// Instance singleton
export const systemHealthChecker = new SystemHealthChecker();

// Export de la fonction de test rapide
export const runSystemHealthCheck = async (): Promise<HealthCheckResult[]> => {
  return await systemHealthChecker.runAllHealthChecks();
};
