import React, { useState, useEffect } from 'react';
import { Bell, X, Eye, EyeOff, Trash2, Calendar, Mail, Phone, Euro } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NotificationData {
  id: string;
  timestamp: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  projectCategory: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'read' | 'responded';
}

export const AdminNotifications: React.FC = () => {
  const { isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    // Charger les notifications existantes
    const loadNotifications = () => {
      const saved = localStorage.getItem('adminNotifications');
      if (saved) {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(parsed);
      }
    };

    loadNotifications();

    // Écouter les nouvelles demandes de devis
    const handleNewQuote = (event: CustomEvent) => {
      const newNotification = event.detail;
      setNotifications(prev => [newNotification, ...prev]);
      
      // Notification visuelle/sonore
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nouvelle demande de devis !', {
          body: `${newNotification.clientName} - ${newNotification.projectTitle}`,
          icon: '/placeholder.svg',
        });
      }
    };

    window.addEventListener('newQuoteRequest', handleNewQuote as EventListener);

    // Demander permission notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('newQuoteRequest', handleNewQuote as EventListener);
    };
  }, [isAdmin]);

  if (!isAdmin) return null;

  const unreadCount = notifications.filter(n => n.status === 'new').length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, status: 'read' as const } : n
      );
      localStorage.setItem('adminNotifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('adminNotifications', JSON.stringify(updated));
      return updated;
    });
    setSelectedNotification(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getBudgetLabel = (budget: string) => {
    const labels: { [key: string]: string } = {
      '500-1000': '500€ - 1,000€',
      '1000-2500': '1,000€ - 2,500€',
      '2500-5000': '2,500€ - 5,000€',
      '5000-10000': '5,000€ - 10,000€',
      '10000+': 'Plus de 10,000€',
      'a-discuter': 'À discuter',
    };
    return labels[budget] || budget;
  };

  const getTimelineLabel = (timeline: string) => {
    const labels: { [key: string]: string } = {
      'urgent': 'Urgent (moins de 2 semaines)',
      '1-month': '1 mois',
      '2-3-months': '2-3 mois',
      '3-6-months': '3-6 mois',
      'flexible': 'Flexible',
    };
    return labels[timeline] || timeline;
  };

  return (
    <>
      {/* Notification Button */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Panel */}
        {isOpen && (
          <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Demandes de Devis</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} nouvelle(s) demande(s)
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Aucune demande de devis</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      notification.status === 'new' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedNotification(notification);
                      markAsRead(notification.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {notification.clientName}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {notification.projectTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {notification.status === 'new' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                          {notification.projectCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedNotification(null)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <button
                onClick={() => setSelectedNotification(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold">Demande de Devis</h2>
              <p className="text-orange-100 mt-1">
                Reçue le {formatDate(selectedNotification.timestamp)}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations Client</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedNotification.clientEmail}</p>
                    </div>
                  </div>
                  
                  {selectedNotification.clientPhone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-medium">{selectedNotification.clientPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails du Projet</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Titre du projet</p>
                    <p className="font-medium">{selectedNotification.projectTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Catégorie</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                      {selectedNotification.projectCategory}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedNotification.budget && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Euro size={16} className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium">{getBudgetLabel(selectedNotification.budget)}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedNotification.timeline && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Calendar size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Délai</p>
                          <p className="font-medium">{getTimelineLabel(selectedNotification.timeline)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedNotification.message}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => deleteNotification(selectedNotification.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Supprimer</span>
                </button>
                
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${selectedNotification.clientEmail}?subject=Devis pour ${selectedNotification.projectTitle}&body=Bonjour ${selectedNotification.clientName},%0D%0A%0D%0ANous avons bien reçu votre demande concernant "${selectedNotification.projectTitle}".%0D%0A%0D%0ACordialement,%0D%0AMind Graphix Solution`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Répondre par email
                  </a>
                  
                  {selectedNotification.clientPhone && (
                    <a
                      href={`tel:${selectedNotification.clientPhone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Appeler
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
