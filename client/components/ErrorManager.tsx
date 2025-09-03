import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Mail,
  FileText,
  Clock,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails: boolean;
}

export class ErrorManager extends Component<Props, State> {
  private errorReportTimer: NodeJS.Timeout | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: "",
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorManager caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Envoyer le rapport d'erreur après un délai
    this.scheduleErrorReport(error, errorInfo);
  }

  private scheduleErrorReport = (error: Error, errorInfo: ErrorInfo) => {
    if (this.errorReportTimer) {
      clearTimeout(this.errorReportTimer);
    }

    this.errorReportTimer = setTimeout(() => {
      this.sendErrorReport(error, errorInfo);
    }, 5000);
  };

  private sendErrorReport = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const report = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Stocker localement pour debug
      const existingReports = JSON.parse(
        localStorage.getItem("errorReports") || "[]",
      );
      existingReports.push(report);

      // Garder seulement les 10 derniers rapports
      if (existingReports.length > 10) {
        existingReports.splice(0, existingReports.length - 10);
      }

      localStorage.setItem("errorReports", JSON.stringify(existingReports));

      console.log("Rapport d'erreur créé:", report);
    } catch (reportError) {
      console.error("Erreur lors de la création du rapport:", reportError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      showDetails: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  public render() {
    if (this.state.hasError) {
      // Interface d'erreur personnalisée
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Oups ! Une erreur s'est produite
                  </h1>
                  <p className="text-red-100 mt-1">
                    Ne vous inquiétez pas, nous sommes là pour vous aider.
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Message d'erreur simplifié */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Bug className="text-red-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">
                      Erreur Technique
                    </h3>
                    <p className="text-red-700 text-sm">
                      {this.state.error?.message ||
                        "Une erreur inattendue s'est produite"}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-red-600">
                      <Clock size={14} />
                      <span>ID: {this.state.errorId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions suggérées */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Solutions suggérées :
                </h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Essayez de rafraîchir la page</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Vérifiez votre connexion internet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Revenez à la page d'accueil</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Contactez notre support si le problème persiste</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Réessayer
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Actualiser
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Home size={16} className="mr-2" />
                  Accueil
                </Button>
              </div>

              {/* Support */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-600 text-sm mb-3">
                  Besoin d'aide ? Notre équipe est là pour vous.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="mailto:support@mindgraphix.com"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <Mail size={16} />
                    <span>support@mindgraphix.com</span>
                  </a>
                  <a
                    href="tel:+22654191605"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <span>📞</span>
                    <span>+226 54191605</span>
                  </a>
                </div>
              </div>

              {/* Détails techniques (collapsible) */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FileText size={16} />
                  <span>
                    {this.state.showDetails ? "Masquer" : "Afficher"} les
                    détails techniques
                  </span>
                </button>

                <AnimatePresence>
                  {this.state.showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-600 overflow-auto max-h-40"
                    >
                      <div className="mb-2">
                        <strong>Erreur:</strong> {this.state.error?.message}
                      </div>
                      {this.state.error?.stack && (
                        <div className="mb-2">
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour récupérer les rapports d'erreur
export const useErrorReports = () => {
  const getErrorReports = () => {
    try {
      return JSON.parse(localStorage.getItem("errorReports") || "[]");
    } catch {
      return [];
    }
  };

  const clearErrorReports = () => {
    localStorage.removeItem("errorReports");
  };

  return { getErrorReports, clearErrorReports };
};

// Composant pour afficher les erreurs globales
export const GlobalErrorDisplay: React.FC = () => {
  const [errors, setErrors] = React.useState<any[]>([]);
  const { getErrorReports, clearErrorReports } = useErrorReports();

  React.useEffect(() => {
    setErrors(getErrorReports());
  }, []);

  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {errors.slice(-3).map((error, index) => (
          <motion.div
            key={error.errorId}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-red-500 text-white p-4 rounded-lg shadow-lg mb-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm">Erreur détectée</h4>
                <p className="text-xs text-red-100 mt-1">
                  {error.message.substring(0, 50)}...
                </p>
              </div>
              <button
                onClick={() => {
                  const newErrors = errors.filter(
                    (e) => e.errorId !== error.errorId,
                  );
                  setErrors(newErrors);
                  if (newErrors.length === 0) clearErrorReports();
                }}
                className="text-red-200 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
