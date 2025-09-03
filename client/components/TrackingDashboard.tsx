import React, { useState, useEffect } from "react";
import { trackingBot } from "../services/trackingBot";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart3,
  Eye,
  Users,
  Activity,
  Clock,
  MousePointer,
  MessageSquare,
  Shield,
  Trash2,
  Download,
} from "lucide-react";

export const TrackingDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    if (isVisible) {
      updateStats();
      const interval = setInterval(updateStats, 5000); // Mise à jour toutes les 5 secondes
      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isVisible]);

  const updateStats = () => {
    setStats(trackingBot.getGeneralStats());
    setSessionStats(trackingBot.getSessionStats());
  };

  const exportData = () => {
    const allEvents = trackingBot.getAllEvents();
    const dataStr = JSON.stringify(allEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `tracking_data_${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (
      confirm("Êtes-vous sûr de vouloir effacer toutes les données de suivi ?")
    ) {
      trackingBot.clearAllData();
      updateStats();
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("fr-FR");
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-32 right-6 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3"
          title="Ouvrir le tableau de bord de suivi"
        >
          <BarChart3 size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-white rounded-lg shadow-2xl border overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 size={24} />
          <h2 className="text-xl font-bold">Bot de Suivi - Tableau de Bord</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-purple-600"
          >
            <Download size={16} className="mr-1" />
            Exporter
          </Button>
          <Button
            onClick={clearData}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-red-500 hover:border-red-500"
          >
            <Trash2 size={16} className="mr-1" />
            Effacer
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-purple-600"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-96">
        {/* Session actuelle */}
        {sessionStats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity size={20} />
                <span>Session Actuelle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessionStats.pageViews}
                  </div>
                  <div className="text-sm text-gray-600">Pages vues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sessionStats.interactions}
                  </div>
                  <div className="text-sm text-gray-600">Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDuration(sessionStats.duration)}
                  </div>
                  <div className="text-sm text-gray-600">Durée</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {sessionStats.isAdmin ? "Admin" : "User"}
                  </div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques générales */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-1">
                    <Activity size={16} />
                    <span>Total Événements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.totalEvents}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-1">
                    <Users size={16} />
                    <span>Sessions Uniques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.uniqueSessions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-1">
                    <Shield size={16} />
                    <span>Actions Admin</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {stats.adminEvents}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Types d'événements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 size={20} />
                  <span>Répartition par Type d'Événement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.eventsByType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {type === "page_view" && (
                          <Eye size={16} className="text-blue-500" />
                        )}
                        {type === "user_action" && (
                          <MousePointer size={16} className="text-green-500" />
                        )}
                        {type === "chat_session" && (
                          <MessageSquare
                            size={16}
                            className="text-purple-500"
                          />
                        )}
                        {type === "admin_action" && (
                          <Shield size={16} className="text-red-500" />
                        )}
                        <span className="capitalize">
                          {type.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{String(count)}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(Number(count) / stats.totalEvents) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pages les plus visitées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye size={20} />
                  <span>Pages les Plus Visitées</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.pageViews)
                    .sort(([, a], [, b]) => Number(b) - Number(a))
                    .slice(0, 5)
                    .map(([page, views]) => (
                      <div
                        key={page}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium">{page || "/"}</span>
                        <span className="text-gray-600">
                          {String(views)} vues
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Période de temps */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>
                    Période: {formatTime(stats.timeRange.start)} -{" "}
                    {formatTime(stats.timeRange.end)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {!stats && (
          <div className="text-center py-8">
            <div className="text-gray-500">Chargement des statistiques...</div>
          </div>
        )}
      </div>
    </div>
  );
};
