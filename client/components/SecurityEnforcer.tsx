import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Eye, EyeOff, Lock, Ban, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'unauthorized_access' | 'data_breach_attempt' | 'session_hijack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: string;
  ip?: string;
  userAgent?: string;
  blocked: boolean;
}

interface SecurityConfig {
  maxFailedLogins: number;
  sessionTimeout: number;
  enableBruteForceProtection: boolean;
  enableSessionValidation: boolean;
  enableContentSecurityPolicy: boolean;
  enableXSSProtection: boolean;
  enableAntiTampering: boolean;
}

export const SecurityEnforcer: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<Set<string>>(new Set());
  const [failedAttempts, setFailedAttempts] = useState<Map<string, number>>(new Map());
  const [isMonitoring, setIsMonitoring] = useState(true);

  const securityConfig: SecurityConfig = {
    maxFailedLogins: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    enableBruteForceProtection: true,
    enableSessionValidation: true,
    enableContentSecurityPolicy: true,
    enableXSSProtection: true,
    enableAntiTampering: true
  };

  useEffect(() => {
    initializeSecurity();
    
    if (isMonitoring) {
      const interval = setInterval(monitorSecurity, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const initializeSecurity = () => {
    // Configuration CSP (Content Security Policy)
    if (securityConfig.enableContentSecurityPolicy) {
      setupCSP();
    }

    // Protection XSS
    if (securityConfig.enableXSSProtection) {
      setupXSSProtection();
    }

    // Protection anti-tampering
    if (securityConfig.enableAntiTampering) {
      setupAntiTampering();
    }

    // Validation de session
    if (securityConfig.enableSessionValidation) {
      setupSessionValidation();
    }

    // Monitoring des événements
    setupEventListeners();
  };

  const setupCSP = () => {
    // CSP via meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.builder.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; frame-src 'none';";
    document.head.appendChild(cspMeta);
  };

  const setupXSSProtection = () => {
    // Nettoyer les inputs pour prévenir XSS
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const cleanValue = sanitizeInput(target.value);
        if (cleanValue !== target.value) {
          logSecurityEvent('suspicious_activity', 'high', 'Tentative XSS détectée dans un input', getClientIP());
          target.value = cleanValue;
        }
      });
    });
  };

  const sanitizeInput = (input: string): string => {
    // Supprimer les balises HTML et scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/data:text\/html/gi, '');
  };

  const setupAntiTampering = () => {
    // Détecter les modifications du DOM suspectes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                logSecurityEvent('unauthorized_access', 'critical', 'Injection de script/iframe détectée', getClientIP());
                element.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Détecter les tentatives de manipulation des outils de développement
    let devToolsOpen = false;
    const detectDevTools = () => {
      const start = performance.now();
      debugger;
      const duration = performance.now() - start;
      
      if (duration > 100 && !devToolsOpen) {
        devToolsOpen = true;
        logSecurityEvent('suspicious_activity', 'medium', 'Outils de développement détectés', getClientIP());
      }
    };

    // Vérifier périodiquement
    setInterval(detectDevTools, 1000);
  };

  const setupSessionValidation = () => {
    // Valider la session régulièrement
    setInterval(() => {
      validateSession();
    }, 60000); // Toutes les minutes

    // Détecter les changements d'onglet/fenêtre suspects
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // L'utilisateur a changé d'onglet
        updateSessionActivity();
      }
    });
  };

  const validateSession = () => {
    if (!isAdmin) return;

    const sessionData = localStorage.getItem('supremeSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        // Vérifier l'expiration
        if (now - session.timestamp > securityConfig.sessionTimeout) {
          logSecurityEvent('session_hijack', 'high', 'Session expirée détectée', getClientIP());
          // Forcer la déconnexion
          localStorage.removeItem('supremeSession');
          localStorage.removeItem('supremeAuth');
          window.location.reload();
        }

        // Vérifier l'intégrité
        const currentUserAgent = navigator.userAgent.slice(0, 50);
        if (session.userAgent !== currentUserAgent) {
          logSecurityEvent('session_hijack', 'critical', 'Changement de User-Agent détecté', getClientIP());
        }
      } catch (error) {
        logSecurityEvent('data_breach_attempt', 'high', 'Session corrompue détectée', getClientIP());
      }
    }
  };

  const updateSessionActivity = () => {
    if (isAdmin) {
      const sessionData = localStorage.getItem('supremeSession');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          session.lastActivity = Date.now();
          localStorage.setItem('supremeSession', JSON.stringify(session));
        } catch (error) {
          console.error('Erreur mise à jour session:', error);
        }
      }
    }
  };

  const setupEventListeners = () => {
    // Détecter les tentatives de copier/coller malveillant
    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData?.getData('text') || '';
      if (clipboardData.includes('<script>') || clipboardData.includes('javascript:')) {
        e.preventDefault();
        logSecurityEvent('suspicious_activity', 'medium', 'Tentative de collage de code malveillant', getClientIP());
      }
    });

    // Détecter les tentatives de drag & drop suspects
    document.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer?.files || []);
      files.forEach(file => {
        if (file.type.includes('executable') || file.name.endsWith('.exe') || file.name.endsWith('.bat')) {
          e.preventDefault();
          logSecurityEvent('data_breach_attempt', 'high', 'Tentative de drop de fichier exécutable', getClientIP());
        }
      });
    });

    // Détecter les raccourcis clavier suspects
    document.addEventListener('keydown', (e) => {
      // Bloquer certains raccourcis dangereux
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        if (!isAdmin) {
          e.preventDefault();
          logSecurityEvent('unauthorized_access', 'low', 'Tentative d\'accès aux outils de développement', getClientIP());
        }
      }
    });
  };

  const monitorSecurity = () => {
    // Vérifier l'intégrité des données critiques
    checkDataIntegrity();
    
    // Vérifier les tentatives de brute force
    if (securityConfig.enableBruteForceProtection) {
      checkBruteForceAttempts();
    }
    
    // Nettoyer les anciens événements (garder seulement les 24 dernières heures)
    cleanOldEvents();
  };

  const checkDataIntegrity = () => {
    const criticalKeys = ['adminAuth', 'superAdminAuth', 'supremeAuth', 'siteContent'];
    criticalKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          // Vérifier si les données sont corrompues
          if (key.includes('Auth') && data !== 'true') {
            logSecurityEvent('data_breach_attempt', 'critical', `Corruption détectée: ${key}`, getClientIP());
          }
          if (key === 'siteContent') {
            JSON.parse(data); // Test de parsing
          }
        } catch (error) {
          logSecurityEvent('data_breach_attempt', 'high', `Données corrompues: ${key}`, getClientIP());
        }
      }
    });
  };

  const checkBruteForceAttempts = () => {
    const ip = getClientIP();
    const attempts = failedAttempts.get(ip) || 0;
    
    if (attempts >= securityConfig.maxFailedLogins) {
      if (!blockedIPs.has(ip)) {
        setBlockedIPs(prev => new Set([...prev, ip]));
        logSecurityEvent('failed_login', 'critical', `IP bloquée après ${attempts} tentatives`, ip);
        
        // Bloquer temporairement (5 minutes)
        setTimeout(() => {
          setBlockedIPs(prev => {
            const newSet = new Set(prev);
            newSet.delete(ip);
            return newSet;
          });
          setFailedAttempts(prev => {
            const newMap = new Map(prev);
            newMap.delete(ip);
            return newMap;
          });
        }, 5 * 60 * 1000);
      }
    }
  };

  const cleanOldEvents = () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    setSecurityEvents(prev => prev.filter(event => event.timestamp > oneDayAgo));
  };

  const logSecurityEvent = (
    type: SecurityEvent['type'], 
    severity: SecurityEvent['severity'], 
    details: string, 
    ip?: string
  ) => {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      type,
      severity,
      timestamp: new Date(),
      details,
      ip: ip || getClientIP(),
      userAgent: navigator.userAgent,
      blocked: severity === 'critical'
    };

    setSecurityEvents(prev => [event, ...prev].slice(0, 100)); // Garder max 100 événements

    // Sauvegarder les événements critiques
    if (severity === 'critical' || severity === 'high') {
      const securityLog = JSON.parse(localStorage.getItem('securityLog') || '[]');
      securityLog.unshift(event);
      localStorage.setItem('securityLog', JSON.stringify(securityLog.slice(0, 50)));
    }

    // Notifier les admins des événements critiques
    if (severity === 'critical') {
      notifyAdmins(event);
    }
  };

  const notifyAdmins = (event: SecurityEvent) => {
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.unshift({
      id: Date.now().toString(),
      type: 'security_alert',
      title: '🚨 ALERTE SÉCURITÉ CRITIQUE',
      message: `${event.details} - IP: ${event.ip}`,
      timestamp: new Date().toISOString(),
      read: false,
      urgent: true,
      data: event
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
  };

  const getClientIP = (): string => {
    // En production, récupérer la vraie IP via une API
    return 'localhost'; // Placeholder
  };

  const recordFailedLogin = (ip?: string) => {
    const clientIP = ip || getClientIP();
    const attempts = failedAttempts.get(clientIP) || 0;
    setFailedAttempts(prev => new Map(prev.set(clientIP, attempts + 1)));
    
    logSecurityEvent('failed_login', 'medium', `Tentative de connexion échouée (${attempts + 1}/${securityConfig.maxFailedLogins})`, clientIP);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <Ban size={16} />;
      case 'suspicious_activity': return <Eye size={16} />;
      case 'unauthorized_access': return <Lock size={16} />;
      case 'data_breach_attempt': return <AlertTriangle size={16} />;
      case 'session_hijack': return <Activity size={16} />;
      default: return <Shield size={16} />;
    }
  };

  // Exposer les fonctions pour utilisation externe
  (window as any).securityEnforcer = {
    recordFailedLogin,
    logSecurityEvent,
    sanitizeInput
  };

  // Ne pas afficher d'interface pour les utilisateurs normaux
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="text-green-600" size={20} />
            <h3 className="font-semibold text-gray-900">Sécurité Active</h3>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`p-1 rounded ${isMonitoring ? 'text-green-600' : 'text-gray-400'}`}
          >
            {isMonitoring ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Protection XSS:</span>
            <span className="text-green-600 font-medium">✓ Active</span>
          </div>
          <div className="flex justify-between">
            <span>Anti-tampering:</span>
            <span className="text-green-600 font-medium">✓ Active</span>
          </div>
          <div className="flex justify-between">
            <span>Validation session:</span>
            <span className="text-green-600 font-medium">✓ Active</span>
          </div>
          <div className="flex justify-between">
            <span>IPs bloquées:</span>
            <span className="text-orange-600 font-medium">{blockedIPs.size}</span>
          </div>
        </div>

        {securityEvents.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Événements récents:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {securityEvents.slice(0, 5).map(event => (
                <div key={event.id} className={`p-2 rounded border text-xs ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(event.type)}
                    <span className="font-medium">{event.details}</span>
                  </div>
                  <div className="text-xs opacity-75">
                    {event.timestamp.toLocaleTimeString()} - {event.ip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonction globale pour enregistrer les échecs de connexion
(window as any).recordSecurityFailure = (type: string, details: string) => {
  if ((window as any).securityEnforcer) {
    (window as any).securityEnforcer.logSecurityEvent(type, 'medium', details);
  }
};
