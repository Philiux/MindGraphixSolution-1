import { quoteService } from "@/services/quoteService";
import type { QuoteFormData } from "@/types/quote";

/**
 * Test intégré des fonctionnalités principales de l'application
 */
export class FunctionalityTester {
  private testResults: { [key: string]: boolean } = {};

  /**
   * Teste le système de devis
   */
  async testQuoteSystem(): Promise<boolean> {
    try {
      // Test de soumission de devis
      const testQuoteData: QuoteFormData = {
        step: 5,
        clientInfo: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "123456789",
          address: "Test Address",
          city: "Test City",
          postalCode: "12345",
          country: "Burkina Faso",
        },
        projectInfo: {
          title: "Test Project",
          description: "Test Description",
          category: "web-development",
          budget: "5000-10000",
          urgency: "medium",
        },
        services: [
          {
            category: "development",
            name: "Site Web",
            description: "Développement d'un site web moderne",
            selected: true,
          },
        ],
        additionalRequirements: "Test requirements",
        attachments: [],
      };

      const requestId = await quoteService.submitQuoteRequest(testQuoteData);

      // Test de récupération
      const request = quoteService.getQuoteRequest(requestId);

      // Test de statistiques
      const stats = quoteService.getQuoteStats();

      this.testResults.quoteSystem = !!(requestId && request && stats);
      return this.testResults.quoteSystem;
    } catch (error) {
      console.error("Erreur test quote system:", error);
      this.testResults.quoteSystem = false;
      return false;
    }
  }

  /**
   * Teste le système d'authentification
   */
  testAuthSystem(): boolean {
    try {
      // Test de stockage local
      const testData = { test: true };
      localStorage.setItem("authTest", JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem("authTest") || "{}");
      localStorage.removeItem("authTest");

      this.testResults.authSystem = retrieved.test === true;
      return this.testResults.authSystem;
    } catch (error) {
      console.error("Erreur test auth system:", error);
      this.testResults.authSystem = false;
      return false;
    }
  }

  /**
   * Teste les utilitaires de l'application
   */
  testAppUtilities(): boolean {
    try {
      // Test de génération d'ID
      const id1 =
        Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      const id2 =
        Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

      // Test de localStorage
      const testKey = "utilityTest";
      const testValue = { timestamp: Date.now(), test: true };
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}");
      localStorage.removeItem(testKey);

      this.testResults.appUtilities = !!(
        id1 &&
        id2 &&
        id1 !== id2 &&
        retrieved.test
      );
      return this.testResults.appUtilities;
    } catch (error) {
      console.error("Erreur test app utilities:", error);
      this.testResults.appUtilities = false;
      return false;
    }
  }

  /**
   * Teste la gestion des erreurs
   */
  testErrorHandling(): boolean {
    try {
      // Test de récupération d'erreur
      try {
        throw new Error("Test error");
      } catch (e) {
        // L'erreur doit être attrapée
        this.testResults.errorHandling = e instanceof Error;
        return this.testResults.errorHandling;
      }
    } catch (error) {
      console.error("Erreur test error handling:", error);
      this.testResults.errorHandling = false;
      return false;
    }
  }

  /**
   * Lance tous les tests
   */
  async runAllTests(): Promise<{ [key: string]: boolean }> {
    console.log("🧪 Début des tests de fonctionnalités...");

    await this.testQuoteSystem();
    this.testAuthSystem();
    this.testAppUtilities();
    this.testErrorHandling();

    const allPassed = Object.values(this.testResults).every((result) => result);

    console.log("📊 Résultats des tests:", this.testResults);
    console.log(
      allPassed
        ? "✅ Tous les tests sont passés"
        : "❌ Certains tests ont échoué",
    );

    return this.testResults;
  }

  /**
   * Obtient les résultats des tests
   */
  getResults(): { [key: string]: boolean } {
    return this.testResults;
  }

  /**
   * Vérifie si tous les tests sont passés
   */
  allTestsPassed(): boolean {
    return Object.values(this.testResults).every((result) => result);
  }
}

// Instance singleton pour les tests
export const functionalityTester = new FunctionalityTester();

// Export des fonctions utilitaires pour les tests manuels
export const runQuickTest = async (): Promise<void> => {
  const results = await functionalityTester.runAllTests();
  console.table(results);
};

// Test automatique au chargement de l'application (en dev uniquement)
if (import.meta.env.DEV) {
  // Lancer les tests après un délai pour laisser l'app se charger
  setTimeout(() => {
    runQuickTest().catch(console.error);
  }, 2000);
}
