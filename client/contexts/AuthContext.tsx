import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuthConfig, validateAuthConfig } from "../config/secureAuth";

interface AuthContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isMindAdmin: boolean;
  isLoggedIn: boolean;
  currentUser: { email: string; name?: string; role?: string } | null;
  isEditMode: boolean;
  isInitialized: boolean;
  login: (
    email: string,
    phone: string,
    password: string,
    securityAnswer: string,
  ) => Promise<boolean>;
  loginAdmin: (
    email: string,
    password: string,
    securityAnswer: string,
    secondSecurityAnswer?: string,
  ) => Promise<boolean | string>;
  loginUser: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<boolean>;
  logout: () => void;
  toggleEditMode: () => void;
  updateContent: (key: string, value: any) => void;
  getContent: (key: string, defaultValue?: any) => any;
  forceSave: () => void;
  exportContent: () => void;
  importContent: (content: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isMindAdmin, setIsMindAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name?: string;
    role?: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger l'état d'authentification au démarrage
  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    const savedSuperAuth = localStorage.getItem("superAdminAuth");
    const savedSupremeAuth = localStorage.getItem("supremeAuth");
    const savedMindAuth = localStorage.getItem("mindAdminAuth");
    const savedUser = localStorage.getItem("currentUser");
    const savedContent = localStorage.getItem("siteContent");

    if (savedSupremeAuth === "true" || savedSuperAuth === "true") {
      setIsSuperAdmin(true);
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (savedMindAuth === "true") {
      setIsMindAdmin(true);
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (savedAuth === "true") {
      setIsAdmin(true);
      setIsLoggedIn(true);
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Erreur lors du chargement de l'utilisateur:", e);
      }
    }

    if (savedContent) {
      try {
        setSiteContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Erreur lors du chargement du contenu:", e);
      }
    }

    // Marquer comme initialisé
    setIsInitialized(true);
  }, []);

  const login = async (
    email: string,
    phone: string,
    password: string,
    securityAnswer: string,
  ): Promise<boolean> => {
    // Normaliser le numéro de téléphone (supprimer espaces, préfixes et caractères spéciaux)
    const normalizePhone = (phoneNumber: string): string => {
      return phoneNumber
        .replace(/[\s\-\(\)\+]/g, "")
        .replace(/^226/, "")
        .trim();
    };

    // Charger les administrateurs depuis le stockage
    const savedAdmins = JSON.parse(localStorage.getItem("siteContent") || "{}");
    const systemAdmins = savedAdmins["system.admins"] || [];

    // Système de sécurité avec variables d'environnement
    const getSecureAdmins = () => {
      if (!validateAuthConfig()) {
        console.error("Configuration d'authentification incomplète");
        return [];
      }

      const config = getAuthConfig();

      const supremeAdmin = {
        email: config.supremeEmail,
        phone: config.supremePhone,
        password: config.supremePassword,
        securityAnswer: config.supremeSecurityAnswer,
        name: "Administrateur Suprême",
        role: "supreme",
        isActive: true,
      };

      // Ajouter les administrateurs principaux - RESTAURÉS
      const philippeAdmin = {
        email: "philippefaizsanon@gmail.com",
        phone: "54191605",
        password: "Philius24648",
        securityAnswer: "Bible Black",
        name: "Philippe Faiz Sanon",
        role: "supreme",
        isActive: true,
      };

      const mindGraphixAdmin = {
        email: "mindgraphixsolution@gmail.com",
        phone: "70123456",
        password: "Mind2024@",
        securityAnswer: "Badiori",
        name: "Mind Graphix Solution",
        role: "supreme",
        isActive: true,
      };

      const mindAdmin = {
        email: "admin@mindgraphix.com",
        phone: "70123456",
        password: "admin123",
        securityAnswer: "test",
        name: "Mind Administrateur",
        role: "mind",
        isActive: true,
      };

      return [supremeAdmin, philippeAdmin, mindGraphixAdmin, mindAdmin];
    };

    const defaultAdmins = getSecureAdmins();

    // Fusionner avec les administrateurs créés dynamiquement
    const allAdmins = [...defaultAdmins];
    systemAdmins.forEach((admin: any) => {
      if (
        !defaultAdmins.find(
          (def) => def.email.toLowerCase() === admin.email.toLowerCase(),
        )
      ) {
        allAdmins.push(admin);
      }
    });

    // Rechercher l'administrateur correspondant
    const matchingAdmin = allAdmins.find(
      (admin) =>
        admin.email.toLowerCase() === email.toLowerCase() &&
        normalizePhone(admin.phone) === normalizePhone(phone) &&
        admin.password === password &&
        admin.securityAnswer.toLowerCase() === securityAnswer.toLowerCase() &&
        admin.isActive,
    );

    if (matchingAdmin) {
      if (matchingAdmin.role === "supreme") {
        // Générer un token de session unique
        const sessionToken = btoa(
          Date.now() + "_" + Math.random().toString(36),
        );
        const sessionData = {
          token: sessionToken,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.slice(0, 50),
          ip: "local", // En production, récupérer la vraie IP
        };

        // Vérifier s'il y a déjà une session active
        const existingSession = localStorage.getItem("supremeSession");
        if (existingSession) {
          try {
            const session = JSON.parse(existingSession);
            const timeDiff = Date.now() - session.timestamp;
            // Si une session existe depuis moins de 30 minutes et différent navigateur
            if (
              timeDiff < 30 * 60 * 1000 &&
              session.userAgent !== sessionData.userAgent.slice(0, 50)
            ) {
              alert(
                "Une session admin suprême est déjà active sur un autre appareil. Connexion refusée.",
              );
              return false;
            }
          } catch (e) {
            // Session corrompue, on continue
          }
        }

        setIsSuperAdmin(true);
        setIsAdmin(true);
        localStorage.setItem("superAdminAuth", "true");
        localStorage.setItem("supremeAuth", "true");
        localStorage.setItem("supremeSession", JSON.stringify(sessionData));
      } else if (matchingAdmin.role === "mind") {
        setIsMindAdmin(true);
        setIsAdmin(true);
        localStorage.setItem("mindAdminAuth", "true");
      } else {
        setIsAdmin(true);
        localStorage.setItem("adminAuth", "true");
      }

      setIsLoggedIn(true);
      setCurrentUser({
        email,
        name: matchingAdmin.name,
        role: matchingAdmin.role,
      });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          name: matchingAdmin.name,
          role: matchingAdmin.role,
        }),
      );
      return true;
    }

    return false;
  };

  const loginAdmin = async (
    email: string,
    password: string,
    securityAnswer: string,
    secondSecurityAnswer?: string,
  ): Promise<boolean | string> => {
    // Identifiants de secours (toujours actifs) - RESTAURÉS
    const fallbackCredentials = [
      {
        email: "philippefaizsanon@gmail.com",
        password: "Philius24648",
        securityAnswer: "Bible Black",
        secondSecurityAnswer: "Yob",
        name: "Philippe Faiz Sanon",
        isSupreme: true,
      },
      {
        email: "mindgraphixsolution@gmail.com",
        password: "Mind2024@",
        securityAnswer: "Badiori",
        secondSecurityAnswer: "",
        name: "Mind Graphix Solution",
        isSupreme: true,
      },
      {
        email: "admin@mindgraphix.com",
        password: "admin123",
        securityAnswer: "test",
        secondSecurityAnswer: "",
        name: "Mind Admin",
        isSupreme: false,
      },
    ];

    // Vérifier d'abord les identifiants de secours
    for (const cred of fallbackCredentials) {
      if (email.toLowerCase() === cred.email.toLowerCase()) {
        if (
          password === cred.password &&
          securityAnswer.toLowerCase() === cred.securityAnswer.toLowerCase()
        ) {
          // Si deuxième sécurité requise et non fournie
          if (cred.secondSecurityAnswer && !secondSecurityAnswer) {
            return "needs_second_question";
          }
          // Si deuxième sécurité requise et fournie
          if (
            cred.secondSecurityAnswer &&
            secondSecurityAnswer &&
            secondSecurityAnswer.toLowerCase() !==
              cred.secondSecurityAnswer.toLowerCase()
          ) {
            return false;
          }

          // Connexion réussie
          if (cred.isSupreme) {
            setIsSuperAdmin(true);
            localStorage.setItem("superAdminAuth", "true");
            localStorage.setItem("supremeAuth", "true");
          }
          setIsAdmin(true);
          setIsLoggedIn(true);
          setCurrentUser({ email, name: cred.name });

          localStorage.setItem("adminAuth", "true");
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ email, name: cred.name }),
          );

          return true;
        }
      }
    }

    // Si les variables d'environnement sont configurées, les utiliser également
    if (validateAuthConfig()) {
      const config = getAuthConfig();

      // Admin principal avec variables d'environnement
      if (email.toLowerCase() === config.adminEmail.toLowerCase()) {
        if (
          password === config.adminPassword &&
          securityAnswer.toLowerCase() ===
            config.adminSecurityAnswer.toLowerCase()
        ) {
          // Deuxième question de sécurité
          if (
            secondSecurityAnswer &&
            secondSecurityAnswer.toLowerCase() ===
              config.secondAdminSecurityAnswer.toLowerCase()
          ) {
            setIsSuperAdmin(true);
            setIsAdmin(true);
            setIsLoggedIn(true);
            setCurrentUser({ email, name: "Administrateur Principal" });

            localStorage.setItem("superAdminAuth", "true");
            localStorage.setItem("supremeAuth", "true");
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem(
              "currentUser",
              JSON.stringify({ email, name: "Administrateur Principal" }),
            );

            return true;
          } else if (!secondSecurityAnswer) {
            // Première question réussie, indiquer qu'il faut la deuxième
            return "needs_second_question";
          }
        }
      }
    }

    // Charger les admins créés dynamiquement depuis le stockage
    const savedAdmins = JSON.parse(localStorage.getItem("siteContent") || "{}");
    const systemAdmins = savedAdmins["system.admins"] || [];

    // Vérifier parmi les admins créés dynamiquement
    const matchingDynamicAdmin = systemAdmins.find(
      (admin: any) =>
        admin.email.toLowerCase() === email.toLowerCase() &&
        admin.password === password &&
        admin.securityAnswer?.toLowerCase() === securityAnswer.toLowerCase() &&
        admin.isActive,
    );

    if (matchingDynamicAdmin) {
      if (matchingDynamicAdmin.role === "supreme") {
        setIsSuperAdmin(true);
      } else if (matchingDynamicAdmin.role === "mind") {
        setIsMindAdmin(true);
      }

      setIsAdmin(true);
      setIsLoggedIn(true);
      setCurrentUser({
        email,
        name: matchingDynamicAdmin.name,
        role: matchingDynamicAdmin.role,
      });

      localStorage.setItem("adminAuth", "true");
      if (matchingDynamicAdmin.role === "supreme") {
        localStorage.setItem("superAdminAuth", "true");
        localStorage.setItem("supremeAuth", "true");
      } else if (matchingDynamicAdmin.role === "mind") {
        localStorage.setItem("mindAdminAuth", "true");
      }
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          name: matchingDynamicAdmin.name,
          role: matchingDynamicAdmin.role,
        }),
      );

      return true;
    }

    return false;
  };

  const loginUser = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<boolean> => {
    // Simulation de connexion utilisateur normal
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Récupérer les utilisateurs enregistrés
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );

      // Vérifier si l'utilisateur existe avec les bonnes informations
      const matchingUser = registeredUsers.find(
        (user: any) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password &&
          user.isActive,
      );

      if (matchingUser) {
        // Connexion avec utilisateur enregistré
        const user = {
          email: matchingUser.email,
          name: matchingUser.name,
          role: matchingUser.role || "user",
          id: matchingUser.id,
        };
        setIsLoggedIn(true);
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }

      // Pour la démo, accepter toute combinaison email/password (connexions sociales, etc.)
      if (
        email &&
        password &&
        (email.includes("google") || email.includes("facebook") || name)
      ) {
        const user = { email, name: name || email.split("@")[0], role: "user" };
        setIsLoggedIn(true);
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }

    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setIsMindAdmin(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsEditMode(false);
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("supremeAuth");
    localStorage.removeItem("mindAdminAuth");
    localStorage.removeItem("supremeSession");
    localStorage.removeItem("currentUser");
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const updateContent = (key: string, value: any) => {
    if (!isInitialized) return;
    const newContent = { ...siteContent, [key]: value };
    setSiteContent(newContent);
    localStorage.setItem("siteContent", JSON.stringify(newContent));
  };

  const getContent = (key: string, defaultValue: any = "") => {
    if (!isInitialized) return defaultValue;
    return siteContent[key] || defaultValue;
  };

  const forceSave = () => {
    try {
      localStorage.setItem("siteContent", JSON.stringify(siteContent));
      localStorage.setItem("lastSave", new Date().toISOString());
      console.log("Contenu sauvegardé avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const exportContent = () => {
    try {
      const content = {
        ...siteContent,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };
      const dataStr = JSON.stringify(content, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `backup_${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const importContent = (content: any) => {
    try {
      if (typeof content === "string") {
        content = JSON.parse(content);
      }
      setSiteContent(content);
      localStorage.setItem("siteContent", JSON.stringify(content));
      console.log("Contenu importé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isSuperAdmin,
        isMindAdmin,
        isLoggedIn,
        currentUser,
        isEditMode,
        isInitialized,
        login,
        loginAdmin,
        loginUser,
        logout,
        toggleEditMode,
        updateContent,
        getContent,
        forceSave,
        exportContent,
        importContent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Ne pas jeter d'erreur, mais retourner des valeurs par défaut sécurisées
    return {
      isAdmin: false,
      isSuperAdmin: false,
      isMindAdmin: false,
      isLoggedIn: false,
      currentUser: null,
      isEditMode: false,
      isInitialized: false,
      login: async () => false,
      loginAdmin: async () => false,
      loginUser: async () => false,
      logout: () => {},
      toggleEditMode: () => {},
      updateContent: () => {},
      getContent: () => "",
      forceSave: () => {},
      exportContent: () => {},
      importContent: () => {},
    };
  }
  return context;
};
