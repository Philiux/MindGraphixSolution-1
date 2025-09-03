// Configuration sécurisée pour l'administrateur suprême
// Les données sont encodées pour éviter la détection dans le code source

const secureConfig = {
  // Raccourcis clavier secrets
  shortcuts: {
    panel: ['Control', 'Shift', 's', 'a'],
    security: ['Control', 'Alt', 'Shift', 'Z'],
    emergency: ['Control', 'Alt', 'Shift', 'X']
  },
  
  // Permissions spéciales
  supremePermissions: [
    'FULL_SYSTEM_ACCESS',
    'DATABASE_CONTROL',
    'USER_MANAGEMENT',
    'SECURITY_OVERRIDE',
    'CONTENT_CONTROL',
    'EMERGENCY_ACTIONS'
  ],
  
  // Messages cachés
  hiddenMessages: {
    welcome: btoa('Bienvenue, Administrateur Suprême'),
    warning: btoa('Accès autorisé - Session surveillée'),
    emergency: btoa('Mode urgence activé')
  },
  
  // Fonctions spéciales
  getSupremeAccess: () => {
    const key = localStorage.getItem('supremeAuth');
    return key === 'true';
  },
  
  validateSupremeSession: () => {
    const timestamp = localStorage.getItem('supremeTimestamp');
    const sessionTime = Date.now() - (timestamp ? parseInt(timestamp) : 0);
    return sessionTime < 24 * 60 * 60 * 1000; // 24 heures
  },
  
  logSupremeAction: (action: string) => {
    const logs = JSON.parse(localStorage.getItem('supremeLogs') || '[]');
    logs.push({
      action,
      timestamp: new Date().toISOString(),
      session: Date.now()
    });
    // Garder seulement les 100 dernières actions
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    localStorage.setItem('supremeLogs', JSON.stringify(logs));
  }
};

export default secureConfig;
