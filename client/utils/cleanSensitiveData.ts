// Utilitaire pour remplacer les données sensibles par des versions sécurisées
export const cleanSensitiveData = () => {
  console.log("🧹 Nettoyage des données sensibles en cours...");

  // Nettoyer le localStorage de toute donnée sensible
  const sensitiveKeys = [
    "supremeSession",
    "adminCredentials",
    "userPasswords",
    "securityAnswers",
  ];

  sensitiveKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Supprimé: ${key}`);
    }
  });

  // Nettoyer le sessionStorage également
  sensitiveKeys.forEach((key) => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      console.log(`✅ Supprimé de session: ${key}`);
    }
  });

  console.log("✅ Nettoyage terminé - Aucune donnée sensible conservée");
};

// Fonction pour remplacer les emails sensibles
export const sanitizeEmailReferences = (email: string): string => {
  const sensitiveEmails = [
    "philippefaizsanon@gmail.com",
    "mindgraphixsolution@gmail.com",
  ];

  if (sensitiveEmails.includes(email.toLowerCase())) {
    return "contact@mindgraphix.com";
  }

  return email;
};

// Fonction pour remplacer les mots de passe
export const sanitizePassword = (password: string): string => {
  // Si c'est un mot de passe potentiellement sensible, le remplacer
  if (
    password.length > 6 &&
    !password.includes("demo") &&
    !password.includes("test")
  ) {
    return "demo-password";
  }
  return password;
};

// Fonction pour nettoyer les réponses de sécurité
export const sanitizeSecurityAnswer = (answer: string): string => {
  return "demo-answer";
};

// Initialiser le nettoyage au chargement de l'application
if (typeof window !== "undefined") {
  // Exécuter le nettoyage de manière silencieuse
  cleanSensitiveData();
}
