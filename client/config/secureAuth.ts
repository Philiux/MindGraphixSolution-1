interface AuthConfig {
  supremeEmail: string;
  supremePhone: string;
  supremePassword: string;
  supremeSecurityAnswer: string;
  adminEmail: string;
  adminPassword: string;
  adminSecurityAnswer: string;
  secondAdminSecurityAnswer: string;
}

export const getAuthConfig = (): AuthConfig => {
  return {
    supremeEmail: import.meta.env.VITE_SUPREME_EMAIL || "",
    supremePhone: import.meta.env.VITE_SUPREME_PHONE || "",
    supremePassword: import.meta.env.VITE_SUPREME_PASSWORD || "",
    supremeSecurityAnswer: import.meta.env.VITE_SUPREME_SECURITY || "",
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL || "",
    adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "",
    adminSecurityAnswer: import.meta.env.VITE_ADMIN_SECURITY || "",
    secondAdminSecurityAnswer: import.meta.env.VITE_ADMIN_SECURITY_2 || "",
  };
};

// Validation des variables d'environnement
export const validateAuthConfig = (): boolean => {
  const config = getAuthConfig();
  return Object.values(config).every((value) => value !== "");
};
