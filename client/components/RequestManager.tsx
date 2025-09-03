import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Send, 
  Eye,
  Reply,
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface Request {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  priority: 'normal' | 'urgent' | 'quote' | 'support';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  timestamp: string;
  responses: Response[];
}

interface Response {
  id: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  adminName?: string;
}

export const RequestManager: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [isReplying, setIsReplying] = useState(false);

  if (!isAdmin) return null;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const savedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    setRequests(savedRequests.sort((a: Request, b: Request) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const updateRequestStatus = (requestId: string, newStatus: Request['status']) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('userRequests', JSON.stringify(updatedRequests));
    
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const sendReply = async () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      const response: Response = {
        id: Date.now().toString(),
        message: replyMessage,
        timestamp: new Date().toISOString(),
        isAdmin: true,
        adminName: currentUser?.name || 'Administrateur'
      };

      const updatedRequest = {
        ...selectedRequest,
        responses: [...selectedRequest.responses, response],
        status: selectedRequest.status === 'pending' ? 'in_progress' as const : selectedRequest.status
      };

      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id ? updatedRequest : req
      );

      setRequests(updatedRequests);
      setSelectedRequest(updatedRequest);
      localStorage.setItem('userRequests', JSON.stringify(updatedRequests));

      // Notifier le client (simulation)
      const clientNotifications = JSON.parse(localStorage.getItem(`notifications_${selectedRequest.userId}`) || '[]');
      clientNotifications.unshift({
        id: Date.now().toString(),
        type: 'admin_reply',
        title: 'Nouvelle réponse à votre demande',
        message: `Nous avons répondu à votre demande: ${selectedRequest.subject}`,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem(`notifications_${selectedRequest.userId}`, JSON.stringify(clientNotifications));

      setReplyMessage('');
      alert('Réponse envoyée avec succès !');
    } catch (error) {
      console.error('Erreur envoi réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    } finally {
      setIsReplying(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-50 border-red-200';
      case 'quote': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'support': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Gestion des Demandes Clients ({filteredRequests.length})
        </h3>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Toutes</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolues</option>
          </select>
          <Button onClick={loadRequests} size="sm" variant="outline">
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des demandes */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedRequest?.id === request.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 truncate">
                      {request.subject}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <User size={14} className="mr-1" />
                      {request.userName}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate mb-2">
                  {request.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(request.timestamp)}
                  </span>
                  <span className="flex items-center">
                    <Reply size={12} className="mr-1" />
                    {request.responses.length} réponse(s)
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détails et réponse */}
        <div>
          {selectedRequest ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {selectedRequest.subject}
                </h4>
                <div className="flex space-x-2">
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value as any)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="resolved">Résolu</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User size={14} className="mr-1" />
                  {selectedRequest.userName} • {formatDate(selectedRequest.timestamp)}
                </div>
                <p className="text-gray-800">{selectedRequest.message}</p>
              </div>

              {/* Historique des réponses */}
              {selectedRequest.responses.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Historique:</h5>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedRequest.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg ${
                          response.isAdmin 
                            ? 'bg-blue-50 border border-blue-200 ml-4' 
                            : 'bg-gray-50 border border-gray-200 mr-4'
                        }`}
                      >
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          {response.isAdmin ? '👨‍💼 ' + (response.adminName || 'Admin') : '👤 Client'}
                          <span className="ml-2">{formatDate(response.timestamp)}</span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone de réponse */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre réponse:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <Button
                  onClick={sendReply}
                  disabled={!replyMessage.trim() || isReplying}
                  className="mt-3 bg-blue-500 hover:bg-blue-600"
                >
                  {isReplying ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Envoi...
                    </div>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Envoyer la Réponse
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              <Eye size={48} className="mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une demande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
