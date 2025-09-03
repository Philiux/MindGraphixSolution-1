import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export const AdminCredentialsFix: React.FC = () => {
  return null; // Composant désactivé pour sécurité

  const updateContent = (key: string, value: any) => {
    // Mock function for now
  };

  const createWorkingAdmin = () => {
    // Créer un admin avec des identifiants plus simples pour test
    const testAdmin = {
      email: "admin@mindgraphix.com",
      phone: "70123456", // Numéro simple
      password: "admin123",
      securityAnswer: "test",
      name: "Test Admin",
      role: "supreme",
      isActive: true,
    };

    // L'ajouter aux admins du système
    const existingAdmins = JSON.parse(
      localStorage.getItem("siteContent") || "{}",
    );
    const systemAdmins = existingAdmins["system.admins"] || [];

    // Vérifier s'il existe déjà
    const exists = systemAdmins.find(
      (admin: any) => admin.email === testAdmin.email,
    );

    if (!exists) {
      systemAdmins.push(testAdmin);
      updateContent("system.admins", systemAdmins);
      alert(
        "Admin de test créé:\nEmail: admin@mindgraphix.com\nTéléphone: 70123456\nMot de passe: admin123\nRéponse sécurité: test",
      );
    } else {
      alert("Admin de test existe déjà!");
    }
  };

  const createPersonalAdmin = () => {
    const phone = prompt(
      "Entrez votre numéro de téléphone (sans espaces ni préfixes):",
    );
    const password = prompt("Choisissez un mot de passe:");
    const securityAnswer = prompt("Choisissez une réponse de sécurité:");

    if (!phone || !password || !securityAnswer) {
      alert("Tous les champs sont requis!");
      return;
    }

    const personalAdmin = {
      email: "votre@email.com",
      phone: phone,
      password: password,
      securityAnswer: securityAnswer,
      name: "Votre Admin Personnel",
      role: "supreme",
      isActive: true,
    };

    const existingAdmins = JSON.parse(
      localStorage.getItem("siteContent") || "{}",
    );
    const systemAdmins = existingAdmins["system.admins"] || [];

    // Remplacer ou ajouter
    const index = systemAdmins.findIndex(
      (admin: any) => admin.email === personalAdmin.email,
    );
    if (index >= 0) {
      systemAdmins[index] = personalAdmin;
    } else {
      systemAdmins.push(personalAdmin);
    }

    updateContent("system.admins", systemAdmins);
    alert(
      `Admin personnel créé!\nUtilisez ces identifiants:\nEmail: votre@email.com\nTéléphone: ${phone}\nMot de passe: ${password}\nRéponse: ${securityAnswer}`,
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border p-4 space-y-2">
      <h3 className="font-bold text-red-600">🔧 Correctif Admin</h3>
      <Button
        onClick={createWorkingAdmin}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Créer Admin Test
      </Button>
      <Button
        onClick={createPersonalAdmin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Créer Votre Admin
      </Button>
    </div>
  );
};
