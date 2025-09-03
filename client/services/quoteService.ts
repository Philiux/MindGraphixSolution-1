import {
  QuoteFormData,
  QuoteRequest,
  Quote,
  QuoteStatus,
} from "../types/quote";
import { notificationService } from "./notificationService";

class QuoteService {
  private readonly STORAGE_KEY = "quoteRequests";
  private readonly QUOTES_KEY = "quotes";

  // Soumettre une nouvelle demande de devis
  submitQuoteRequest(formData: QuoteFormData): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const quoteRequest: QuoteRequest = {
          id: this.generateId(),
          clientInfo: {
            firstName: formData.clientInfo.firstName || "",
            lastName: formData.clientInfo.lastName || "",
            email: formData.clientInfo.email || "",
            phone: formData.clientInfo.phone || "",
            company: formData.clientInfo.company,
            address: formData.clientInfo.address || "",
            city: formData.clientInfo.city || "",
            postalCode: formData.clientInfo.postalCode || "",
            country: formData.clientInfo.country || "Burkina Faso",
          },
          projectInfo: {
            title: formData.projectInfo.title || "",
            description: formData.projectInfo.description || "",
            category: formData.projectInfo.category || "web-development",
            deadline: formData.projectInfo.deadline,
            budget: formData.projectInfo.budget || "to-discuss",
            urgency: formData.projectInfo.urgency || "medium",
          },
          services: formData.services.filter((s) => s.selected),
          additionalRequirements: formData.additionalRequirements,
          attachments: formData.attachments,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Sauvegarder dans localStorage
        const existingRequests = this.getQuoteRequests();
        existingRequests.push(quoteRequest);
        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify(existingRequests),
        );

        // Créer une notification pour les administrateurs
        notificationService.notifyNewQuoteRequest(
          quoteRequest.clientInfo,
          quoteRequest.projectInfo,
        );

        // Simuler un délai de traitement
        setTimeout(() => {
          resolve(quoteRequest.id!);
        }, 1000);
      } catch (error) {
        reject(
          new Error("Erreur lors de la soumission de la demande de devis"),
        );
      }
    });
  }

  // Récupérer toutes les demandes de devis
  getQuoteRequests(): QuoteRequest[] {
    try {
      const requests = localStorage.getItem(this.STORAGE_KEY);
      if (!requests) return [];

      return JSON.parse(requests).map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
        projectInfo: {
          ...req.projectInfo,
          deadline: req.projectInfo.deadline
            ? new Date(req.projectInfo.deadline)
            : undefined,
        },
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      return [];
    }
  }

  // Récupérer une demande spécifique
  getQuoteRequest(id: string): QuoteRequest | null {
    const requests = this.getQuoteRequests();
    return requests.find((req) => req.id === id) || null;
  }

  // Récupérer les demandes d'un client spécifique
  getClientQuoteRequests(clientEmail: string): QuoteRequest[] {
    const requests = this.getQuoteRequests();
    return requests.filter(
      (req) =>
        (req.clientInfo?.email || "").toLowerCase() ===
        (clientEmail || "").toLowerCase(),
    );
  }

  // Mettre à jour le statut d'une demande
  updateQuoteStatus(id: string, status: QuoteStatus): boolean {
    try {
      const requests = this.getQuoteRequests();
      const requestIndex = requests.findIndex((req) => req.id === id);

      if (requestIndex === -1) return false;

      requests[requestIndex].status = status;
      requests[requestIndex].updatedAt = new Date();

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));

      // Déclencher un événement pour notifier les composants
      window.dispatchEvent(
        new CustomEvent("quoteStatusUpdated", {
          detail: { id, status },
        }),
      );

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return false;
    }
  }

  // Générer un devis à partir d'une demande
  generateQuote(
    requestId: string,
    pricing: any,
    timeline: any,
    terms: any,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const request = this.getQuoteRequest(requestId);
        if (!request) {
          reject(new Error("Demande de devis introuvable"));
          return;
        }

        const quote: Quote = {
          id: this.generateId(),
          requestId,
          quoteNumber: this.generateQuoteNumber(),
          clientInfo: request.clientInfo,
          projectInfo: request.projectInfo,
          services: request.services.map((service, index) => ({
            id: this.generateId(),
            name: service.name,
            description: service.description || "",
            quantity: 1,
            unitPrice: pricing.services?.[index]?.price || 0,
            total: pricing.services?.[index]?.price || 0,
            category: service.category,
          })),
          pricing: {
            subtotal: pricing.subtotal || 0,
            tax: pricing.tax || 0,
            total: pricing.total || 0,
            currency: "FCFA",
          },
          timeline: {
            estimatedStartDate: timeline.startDate || new Date(),
            estimatedEndDate: timeline.endDate || new Date(),
            milestones: timeline.milestones || [],
          },
          terms: {
            validUntil:
              terms.validUntil ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            paymentTerms:
              terms.paymentTerms || "50% à la commande, 50% à la livraison",
            deliverables: terms.deliverables || [],
            additionalNotes: terms.additionalNotes,
          },
          status: "sent",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Sauvegarder le devis
        const existingQuotes = this.getQuotes();
        existingQuotes.push(quote);
        localStorage.setItem(this.QUOTES_KEY, JSON.stringify(existingQuotes));

        // Mettre à jour le statut de la demande
        this.updateQuoteStatus(requestId, "sent");

        resolve(quote.id);
      } catch (error) {
        reject(new Error("Erreur lors de la génération du devis"));
      }
    });
  }

  // Récupérer tous les devis
  getQuotes(): Quote[] {
    try {
      const quotes = localStorage.getItem(this.QUOTES_KEY);
      if (!quotes) return [];

      return JSON.parse(quotes).map((quote: any) => ({
        ...quote,
        createdAt: new Date(quote.createdAt),
        updatedAt: new Date(quote.updatedAt),
        acceptedAt: quote.acceptedAt ? new Date(quote.acceptedAt) : undefined,
        paidAt: quote.paidAt ? new Date(quote.paidAt) : undefined,
        timeline: {
          ...quote.timeline,
          estimatedStartDate: new Date(quote.timeline.estimatedStartDate),
          estimatedEndDate: new Date(quote.timeline.estimatedEndDate),
          milestones: quote.timeline.milestones.map((m: any) => ({
            ...m,
            dueDate: new Date(m.dueDate),
          })),
        },
        terms: {
          ...quote.terms,
          validUntil: new Date(quote.terms.validUntil),
        },
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des devis:", error);
      return [];
    }
  }

  // Récupérer un devis spécifique
  getQuote(id: string): Quote | null {
    const quotes = this.getQuotes();
    return quotes.find((quote) => quote.id === id) || null;
  }

  // Accepter un devis
  acceptQuote(id: string): boolean {
    try {
      const quotes = this.getQuotes();
      const quoteIndex = quotes.findIndex((quote) => quote.id === id);

      if (quoteIndex === -1) return false;

      quotes[quoteIndex].status = "accepted";
      quotes[quoteIndex].acceptedAt = new Date();
      quotes[quoteIndex].updatedAt = new Date();

      localStorage.setItem(this.QUOTES_KEY, JSON.stringify(quotes));

      // Mettre à jour la demande correspondante
      this.updateQuoteStatus(quotes[quoteIndex].requestId, "accepted");

      return true;
    } catch (error) {
      console.error("Erreur lors de l'acceptation du devis:", error);
      return false;
    }
  }

  // Rejeter un devis
  rejectQuote(id: string): boolean {
    try {
      const quotes = this.getQuotes();
      const quoteIndex = quotes.findIndex((quote) => quote.id === id);

      if (quoteIndex === -1) return false;

      quotes[quoteIndex].status = "rejected";
      quotes[quoteIndex].updatedAt = new Date();

      localStorage.setItem(this.QUOTES_KEY, JSON.stringify(quotes));

      // Mettre à jour la demande correspondante
      this.updateQuoteStatus(quotes[quoteIndex].requestId, "rejected");

      return true;
    } catch (error) {
      console.error("Erreur lors du rejet du devis:", error);
      return false;
    }
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Générer un numéro de devis
  private generateQuoteNumber(): string {
    const quotes = this.getQuotes();
    const count = quotes.length + 1;
    const year = new Date().getFullYear();
    return `DEV-${year}-${count.toString().padStart(3, "0")}`;
  }

  // Statistiques pour les administrateurs
  getQuoteStats() {
    const requests = this.getQuoteRequests();
    const quotes = this.getQuotes();

    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      totalQuotes: quotes.length,
      acceptedQuotes: quotes.filter((q) => q.status === "accepted").length,
      rejectedQuotes: quotes.filter((q) => q.status === "rejected").length,
      revenue: quotes
        .filter((q) => q.status === "accepted")
        .reduce((sum, q) => sum + q.pricing.total, 0),
    };
  }
}

// Instance singleton
export const quoteService = new QuoteService();
