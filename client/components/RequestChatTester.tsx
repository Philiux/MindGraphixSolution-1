import React, { useState } from 'react';
import { MessageSquare, Send, User, TestTube, Plus, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const RequestChatTester: React.FC = () => {
  const { isAdmin } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  if (!isAdmin) return null;

  const addTestResult = (message: string) => {
    setTestResults(prev => [message, ...prev]);
  };

  const createTestRequest = () => {
    const testRequest = {
      id: Date.now().toString(),
      userId: 'test@example.com',
      userName: 'Utilisateur Test',
      subject: 'Test de demande automatique',
      message: 'Ceci est un test automatique du système de demandes. Pouvez-vous me confirmer que vous recevez bien ce message ?',
      priority: 'normal' as const,
      status: 'pending' as const,
      timestamp: new Date().toISOString(),
      responses: []
    };

    // Ajouter aux demandes
    const existingRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    existingRequests.push(testRequest);
    localStorage.setItem('userRequests', JSON.stringify(existingRequests));

    // Créer notification admin
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.unshift({
      id: Date.now().toString(),
      type: 'new_request',
      title: 'Nouvelle demande de test',
      message: `${testRequest.userName} a envoyé une demande de test`,
      timestamp: new Date().toISOString(),
      read: false,
      data: testRequest
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));

    addTestResult('✅ Demande de test créée avec succès');
  };

  const createTestChatSession = () => {
    const testSession = {
      id: Date.now().toString(),
      clientId: 'test-chat@example.com',
      clientName: 'Client Test Chat',
      messages: [
        {
          id: Date.now().toString(),
          message: 'Bonjour ! Je teste le système de chat.',
          timestamp: new Date().toISOString(),
          sender: 'client' as const,
          senderName: 'Client Test'
        },
        {
          id: (Date.now() + 1).toString(),
          message: 'Bonjour ! Comment pouvons-nous vous aider ?',
          timestamp: new Date().toISOString(),
          sender: 'admin' as const,
          senderName: 'Assistant'
        }
      ],
      status: 'active' as const,
      lastActivity: new Date().toISOString()
    };

    // Ajouter aux sessions de chat
    const existingSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    existingSessions.push(testSession);
    localStorage.setItem('chatSessions', JSON.stringify(existingSessions));

    // Notification admin
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.unshift({
      id: Date.now().toString(),
      type: 'new_chat_message',
      title: 'Nouvelle session de chat test',
      message: `${testSession.clientName} a démarré une conversation`,
      timestamp: new Date().toISOString(),
      read: false,
      data: testSession
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));

    addTestResult('✅ Session de chat de test créée avec succès');
  };

  const createTestNotification = () => {
    const testNotification = {
      id: Date.now().toString(),
      type: 'system',
      title: 'Test du système de notifications',
      message: 'Ceci est une notification de test pour vérifier que le système fonctionne correctement.',
      timestamp: new Date().toISOString(),
      read: false
    };

    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.unshift(testNotification);
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));

    addTestResult('✅ Notification de test créée');
  };

  const createClientNotification = () => {
    const clientEmail = 'test@example.com';
    const testNotification = {
      id: Date.now().toString(),
      type: 'admin_reply',
      title: 'Réponse de test de l\'administration',
      message: 'Nous avons bien reçu votre demande et y répondrons dans les plus brefs délais.',
      timestamp: new Date().toISOString(),
      read: false
    };

    const clientNotifications = JSON.parse(
      localStorage.getItem(`notifications_${clientEmail}`) || '[]'
    );
    clientNotifications.unshift(testNotification);
    localStorage.setItem(
      `notifications_${clientEmail}`, 
      JSON.stringify(clientNotifications)
    );

    addTestResult('✅ Notification client créée pour test@example.com');
  };

  const checkSystemIntegrity = () => {
    const checks = [];

    // Vérifier les demandes
    const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    checks.push(`📋 ${requests.length} demande(s) dans le système`);

    // Vérifier les chats
    const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    checks.push(`💬 ${chatSessions.length} session(s) de chat`);

    // Vérifier les notifications admin
    const adminNotifs = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    checks.push(`🔔 ${adminNotifs.length} notification(s) admin`);

    // Vérifier les notifications clients
    const allKeys = Object.keys(localStorage);
    const clientNotifKeys = allKeys.filter(key => key.startsWith('notifications_'));
    let totalClientNotifs = 0;
    clientNotifKeys.forEach(key => {
      const notifs = JSON.parse(localStorage.getItem(key) || '[]');
      totalClientNotifs += notifs.length;
    });
    checks.push(`👤 ${totalClientNotifs} notification(s) client sur ${clientNotifKeys.length} compte(s)`);

    checks.forEach(check => addTestResult(check));
    addTestResult('🔍 Vérification d\'intégrité terminée');
  };

  const clearAllTestData = () => {
    if (confirm('Supprimer toutes les données de test ? Cette action est irréversible.')) {
      // Nettoyer les données de test
      localStorage.removeItem('userRequests');
      localStorage.removeItem('chatSessions');
      localStorage.removeItem('adminNotifications');
      
      // Nettoyer les notifications clients de test
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('notifications_test')) {
          localStorage.removeItem(key);
        }
      });

      addTestResult('🧹 Toutes les données de test supprimées');
      setTestResults([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <TestTube size={20} className="mr-2" />
          Testeur Demandes & Chat
        </h3>
      </div>

      {/* Actions de test */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Tests de Demandes
          </h4>
          <Button
            onClick={createTestRequest}
            className="w-full bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Créer Demande Test
          </Button>
          <Button
            onClick={createTestNotification}
            className="w-full bg-green-500 hover:bg-green-600"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Créer Notification Admin
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 flex items-center">
            <Send size={16} className="mr-2" />
            Tests de Chat
          </h4>
          <Button
            onClick={createTestChatSession}
            className="w-full bg-purple-500 hover:bg-purple-600"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Créer Session Chat
          </Button>
          <Button
            onClick={createClientNotification}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Créer Notification Client
          </Button>
        </div>
      </div>

      {/* Actions système */}
      <div className="flex space-x-3 mb-6">
        <Button
          onClick={checkSystemIntegrity}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <CheckCircle size={16} />
          <span>Vérifier Intégrité</span>
        </Button>
        <Button
          onClick={clearAllTestData}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
        >
          <TestTube size={16} />
          <span>Nettoyer Tests</span>
        </Button>
      </div>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Résultats des Tests</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="text-sm font-mono bg-white p-2 rounded border"
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions de Test</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. Créez des données de test avec les boutons ci-dessus</p>
          <p>2. Vérifiez que les données apparaissent dans les onglets "Demandes" et "Chat"</p>
          <p>3. Testez les réponses et interactions dans ces onglets</p>
          <p>4. Vérifiez l'intégrité du système régulièrement</p>
          <p>5. Nettoyez les données de test après utilisation</p>
        </div>
      </div>
    </div>
  );
};
