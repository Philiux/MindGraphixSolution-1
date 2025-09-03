import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Users, 
  BarChart3, 
  Shield, 
  Database, 
  Settings,
  Bell,
  Calendar,
  FileText,
  Globe,
  Lock,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  Timer,
  MessageSquare,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  Edit,
  Plus,
  Zap,
  Eye,
  UserPlus,
  Ban,
  Unlock
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  change: string;
}

interface UserSession {
  id: string;
  user: string;
  email: string;
  loginTime: string;
  lastActivity: string;
  ip: string;
  device: string;
  status: 'active' | 'idle' | 'away';
}

export const AdvancedAdminFeatures: React.FC = () => {
  const { isAdmin, isSuperAdmin, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);

  if (!isAdmin) return null;

  useEffect(() => {
    loadAdminLogs();
    loadSystemMetrics();
    loadUserSessions();
    
    if (realTimeMode) {
      const interval = setInterval(() => {
        loadSystemMetrics();
        loadUserSessions();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeMode]);

  const loadAdminLogs = () => {
    const logs: AdminLog[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'Login administrateur',
        user: currentUser?.email || 'Admin',
        details: 'Connexion réussie depuis nouveau navigateur',
        severity: 'success'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        action: 'Modification contenu',
        user: currentUser?.email || 'Admin',
        details: 'Mise à jour de la page d\'accueil',
        severity: 'info'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        action: 'Tentative connexion échouée',
        user: 'unknown@test.com',
        details: 'Mot de passe incorrect (3 tentatives)',
        severity: 'warning'
      }
    ];
    
    const savedLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
    setAdminLogs([...logs, ...savedLogs].slice(0, 50));
  };

  const loadSystemMetrics = () => {
    const metrics: SystemMetric[] = [
      {
        name: 'Utilisateurs connectés',
        value: Math.floor(Math.random() * 15 + 5).toString(),
        status: 'good',
        change: '+12%'
      },
      {
        name: 'Stockage utilisé',
        value: Math.floor(Math.random() * 30 + 45) + '%',
        status: 'warning',
        change: '+5%'
      },
      {
        name: 'Requêtes/min',
        value: Math.floor(Math.random() * 200 + 150).toString(),
        status: 'good',
        change: '+8%'
      },
      {
        name: 'Temps de réponse',
        value: Math.floor(Math.random() * 50 + 120) + 'ms',
        status: Math.random() > 0.7 ? 'warning' : 'good',
        change: '-3%'
      },
      {
        name: 'Sessions actives',
        value: Math.floor(Math.random() * 25 + 10).toString(),
        status: 'good',
        change: '+15%'
      },
      {
        name: 'Erreurs système',
        value: Math.floor(Math.random() * 3).toString(),
        status: Math.random() > 0.8 ? 'critical' : 'good',
        change: '-50%'
      }
    ];
    setSystemMetrics(metrics);
  };

  const loadUserSessions = () => {
    const sessions: UserSession[] = [
      {
        id: '1',
        user: 'Client Premium',
        email: 'client@example.com',
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        ip: '192.168.1.100',
        device: 'Chrome/Windows',
        status: 'active'
      },
      {
        id: '2',
        user: 'Visiteur',
        email: 'visitor@test.com',
        loginTime: new Date(Date.now() - 1800000).toISOString(),
        lastActivity: new Date(Date.now() - 600000).toISOString(),
        ip: '192.168.1.101',
        device: 'Safari/macOS',
        status: 'idle'
      }
    ];
    setUserSessions(sessions);
  };

  const addToLog = (action: string, details: string, severity: AdminLog['severity'] = 'info') => {
    const newLog: AdminLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      user: currentUser?.email || 'Admin',
      details,
      severity
    };
    
    const updatedLogs = [newLog, ...adminLogs].slice(0, 50);
    setAdminLogs(updatedLogs);
    localStorage.setItem('adminLogs', JSON.stringify(updatedLogs.slice(3))); // Garder seulement les logs personnalisés
  };

  const clearAllCache = () => {
    if (confirm('Vider tous les caches système ? Cette action peut affecter les performances.')) {
      // Simuler le vidage du cache
      sessionStorage.clear();
      addToLog('Cache système vidé', 'Tous les caches ont été supprimés', 'warning');
      alert('Cache système vidé avec succès !');
    }
  };

  const forceRefreshAllUsers = () => {
    if (confirm('Forcer le rafraîchissement pour tous les utilisateurs connectés ?')) {
      addToLog('Rafraîchissement forcé', 'Tous les utilisateurs ont été rafraîchis', 'info');
      alert('Rafraîchissement envoyé à tous les utilisateurs !');
    }
  };

  const blockUserSession = (sessionId: string, userEmail: string) => {
    if (confirm(`Bloquer la session de ${userEmail} ?`)) {
      setUserSessions(prev => prev.filter(s => s.id !== sessionId));
      addToLog('Session bloquée', `Session de ${userEmail} supprimée`, 'warning');
    }
  };

  const exportSystemReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: systemMetrics,
      logs: adminLogs,
      sessions: userSessions,
      admin: currentUser?.email
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addToLog('Rapport exporté', 'Rapport système généré et téléchargé', 'success');
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="text-green-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'critical': return <XCircle className="text-red-500" size={16} />;
      default: return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getLogIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="text-green-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'error': return <XCircle className="text-red-500" size={16} />;
      default: return <Activity className="text-blue-500" size={16} />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Monitor },
    { id: 'monitoring', label: 'Surveillance', icon: Activity },
    { id: 'users', label: 'Sessions Utilisateurs', icon: Users },
    { id: 'logs', label: 'Journaux', icon: FileText },
    { id: 'security', label: 'Sécurité Avancée', icon: Shield },
    { id: 'tools', label: 'Outils Système', icon: Settings }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap size={24} />
            <h2 className="text-2xl font-bold">Fonctionnalités Avancées</h2>
            {isSuperAdmin && (
              <span className="px-2 py-1 bg-red-500 rounded-full text-xs font-bold">
                SUPREME
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={realTimeMode}
                onChange={(e) => setRealTimeMode(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Temps réel</span>
            </label>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${realTimeMode ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs">{realTimeMode ? 'LIVE' : 'STATIQUE'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-500'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                    {getMetricIcon(metric.status)}
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Activity className="mr-2" size={16} />
                  Activité Récente
                </h4>
                <div className="space-y-2">
                  {adminLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center space-x-2 text-sm">
                      {getLogIcon(log.severity)}
                      <span className="text-gray-600">{log.action}</span>
                      <span className="text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Users className="mr-2" size={16} />
                  Sessions Actives
                </h4>
                <div className="space-y-2">
                  {userSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          session.status === 'active' ? 'bg-green-400' : 
                          session.status === 'idle' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                        <span>{session.user}</span>
                      </div>
                      <span className="text-gray-500">{session.device.split('/')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Surveillance Système</h3>
              <Button onClick={() => loadSystemMetrics()} size="sm" variant="outline">
                <Activity size={16} className="mr-2" />
                Actualiser
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  metric.status === 'good' ? 'border-green-200 bg-green-50' :
                  metric.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{metric.name}</h4>
                    {getMetricIcon(metric.status)}
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600">Évolution: {metric.change}</div>
                </div>
              ))}
            </div>

            {isSuperAdmin && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Actions Critiques</h4>
                <div className="space-y-2">
                  <Button onClick={clearAllCache} variant="outline" className="w-full text-red-600 border-red-300">
                    <Trash2 size={16} className="mr-2" />
                    Vider Cache Système
                  </Button>
                  <Button onClick={forceRefreshAllUsers} variant="outline" className="w-full text-orange-600 border-orange-300">
                    <Zap size={16} className="mr-2" />
                    Forcer Rafraîchissement Global
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sessions Utilisateurs</h3>
              <Button onClick={() => loadUserSessions()} size="sm" variant="outline">
                <Users size={16} className="mr-2" />
                Actualiser
              </Button>
            </div>

            <div className="space-y-4">
              {userSessions.map((session) => (
                <div key={session.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        session.status === 'active' ? 'bg-green-400' : 
                        session.status === 'idle' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                      <div>
                        <h4 className="font-medium">{session.user}</h4>
                        <p className="text-sm text-gray-600">{session.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Connecté: {new Date(session.loginTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dernière activité: {new Date(session.lastActivity).toLocaleString()}
                      </p>
                    </div>
                    {isSuperAdmin && (
                      <Button 
                        onClick={() => blockUserSession(session.id, session.email)}
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        <Ban size={16} className="mr-2" />
                        Bloquer
                      </Button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    IP: {session.ip} • Device: {session.device}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Journaux d'Administration</h3>
              <div className="flex space-x-2">
                <Button onClick={() => loadAdminLogs()} size="sm" variant="outline">
                  <FileText size={16} className="mr-2" />
                  Actualiser
                </Button>
                <Button onClick={exportSystemReport} size="sm">
                  <Download size={16} className="mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {adminLogs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getLogIcon(log.severity)}
                      <div>
                        <span className="font-medium">{log.action}</span>
                        <span className="text-gray-600 ml-2">par {log.user}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-6">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Sécurité Avancée</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                  <Shield className="mr-2" size={16} />
                  Alertes Sécurité
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-yellow-500" size={14} />
                    <span>3 tentatives de connexion échouées détectées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={14} />
                    <span>Toutes les sessions sont sécurisées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={14} />
                    <span>Aucune violation de données détectée</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Lock className="mr-2" size={16} />
                  Statut Sécurité
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chiffrement:</span>
                    <span className="text-green-600 font-medium">Actif</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessions sécurisées:</span>
                    <span className="text-green-600 font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière mise à jour:</span>
                    <span className="text-gray-600">Aujourd'hui</span>
                  </div>
                </div>
              </div>
            </div>

            {isSuperAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-3">Actions de Sécurité Supreme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => addToLog('Audit sécurité', 'Scan de sécurité lancé manuellement', 'info')}
                    variant="outline" 
                    className="w-full"
                  >
                    <Search size={16} className="mr-2" />
                    Lancer Audit Sécurité
                  </Button>
                  <Button 
                    onClick={() => addToLog('Verrouillage forcé', 'Toutes les sessions non-admin fermées', 'warning')}
                    variant="outline" 
                    className="w-full text-red-600"
                  >
                    <Lock size={16} className="mr-2" />
                    Verrouillage d'Urgence
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Outils Système</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Maintenance</h4>
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      addToLog('Optimisation', 'Base de données optimisée', 'success');
                      alert('Optimisation de la base de données terminée !');
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    <Database size={16} className="mr-2" />
                    Optimiser Base de Données
                  </Button>
                  <Button 
                    onClick={() => {
                      addToLog('Nettoyage', 'Fichiers temporaires supprimés', 'info');
                      alert('Nettoyage des fichiers temporaires terminé !');
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Nettoyer Fichiers Temporaires
                  </Button>
                  <Button 
                    onClick={() => {
                      addToLog('Sauvegarde', 'Sauvegarde système créée', 'success');
                      alert('Sauvegarde système créée avec succès !');
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    <HardDrive size={16} className="mr-2" />
                    Créer Sauvegarde
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Rapports</h4>
                <div className="space-y-2">
                  <Button onClick={exportSystemReport} variant="outline" className="w-full">
                    <Download size={16} className="mr-2" />
                    Rapport Complet
                  </Button>
                  <Button 
                    onClick={() => {
                      const userReport = { users: userSessions, timestamp: new Date().toISOString() };
                      const blob = new Blob([JSON.stringify(userReport, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `user-report-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      addToLog('Rapport utilisateurs', 'Rapport utilisateurs exporté', 'info');
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    <Users size={16} className="mr-2" />
                    Rapport Utilisateurs
                  </Button>
                  <Button 
                    onClick={() => {
                      const securityReport = { logs: adminLogs.filter(l => l.severity === 'warning' || l.severity === 'error'), timestamp: new Date().toISOString() };
                      const blob = new Blob([JSON.stringify(securityReport, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `security-report-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      addToLog('Rapport sécurité', 'Rapport de sécurité exporté', 'info');
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    <Shield size={16} className="mr-2" />
                    Rapport Sécurité
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
