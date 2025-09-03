import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appService } from "./services/appService";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import DemandeDevis from "./pages/DemandeDevis";
import QuoteSent from "./pages/QuoteSent";
import QuoteConfirmation from "./pages/QuoteConfirmation";
import QuoteManagement from "./pages/QuoteManagement";
import MesDevis from "./pages/MesDevis";
import { AdminRoute } from "./components/AdminRoute";

import AppHealthCheckerWrapper from "./components/AppHealthCheckerWrapper";

import { ErrorManager, GlobalErrorDisplay } from "./components/ErrorManager";
import { AnimationProvider } from "./components/AnimationProvider";
import { ThemeProvider } from "./components/ThemeToggle";
import {
  NotificationProvider,
  ToastContainer,
} from "./components/NotificationSystem";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialiser l'application
    appService.initialize().catch((error) => {
      console.error("Erreur lors de l'initialisation de l'application:", error);
    });
  }, []);

  return (
    <ErrorManager>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <AnimationProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div id="main-content">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route
                          path="/demande-devis"
                          element={<DemandeDevis />}
                        />
                        <Route path="/quote-sent" element={<QuoteSent />} />
                        <Route
                          path="/quote/:quoteId"
                          element={<QuoteConfirmation />}
                        />
                        <Route
                          path="/client-dashboard"
                          element={<ClientDashboard />}
                        />
                        <Route path="/mes-devis" element={<MesDevis />} />
                        <Route
                          path="/admin/quotes"
                          element={
                            <AdminRoute>
                              <QuoteManagement />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/*"
                          element={
                            <AdminRoute>
                              <AdminDashboard />
                            </AdminRoute>
                          }
                        />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <AppHealthCheckerWrapper />

                    <ToastContainer />
                    <GlobalErrorDisplay />
                  </BrowserRouter>
                </TooltipProvider>
              </AnimationProvider>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorManager>
  );
}
