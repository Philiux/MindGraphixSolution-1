import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAutoSave = () => {
  const { getContent, updateContent } = useAuth();

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentContent = localStorage.getItem('siteContent');
      if (currentContent) {
        // Optionally, you could save to a server here
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const forceSave = useCallback(() => {
    try {
      const currentContent = localStorage.getItem('siteContent');
      if (currentContent) {
        // Force save
        localStorage.setItem('siteContent_backup', currentContent);
        alert('Contenu sauvegardé avec succès !');
      } else {
        alert('Aucun contenu à sauvegarder');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }, []);

  const exportContent = useCallback(() => {
    try {
      const currentContent = localStorage.getItem('siteContent') || '{}';
      const adminNotifications = localStorage.getItem('adminNotifications') || '[]';
      const userRequests = localStorage.getItem('userRequests') || '[]';
      const chatSessions = localStorage.getItem('chatSessions') || '[]';
      
      const exportData = {
        siteContent: JSON.parse(currentContent),
        adminNotifications: JSON.parse(adminNotifications),
        userRequests: JSON.parse(userRequests),
        chatSessions: JSON.parse(chatSessions),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mind-graphix-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Export terminé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    }
  }, []);

  const importContent = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        // Validate the import data
        if (importData.siteContent) {
          localStorage.setItem('siteContent', JSON.stringify(importData.siteContent));
        }
        
        if (importData.adminNotifications) {
          localStorage.setItem('adminNotifications', JSON.stringify(importData.adminNotifications));
        }
        
        if (importData.userRequests) {
          localStorage.setItem('userRequests', JSON.stringify(importData.userRequests));
        }
        
        if (importData.chatSessions) {
          localStorage.setItem('chatSessions', JSON.stringify(importData.chatSessions));
        }
        
        alert('Import terminé avec succès ! La page va se recharger pour appliquer les modifications.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        alert('Erreur lors de l\'import: fichier invalide');
      }
    };
    
    reader.readAsText(file);
  }, []);

  const resetContent = useCallback(() => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu ? Cette action est irréversible.')) {
      localStorage.removeItem('siteContent');
      localStorage.removeItem('adminNotifications');
      localStorage.removeItem('userRequests');
      localStorage.removeItem('chatSessions');
      
      alert('Contenu réinitialisé. La page va se recharger.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);

  const getBackupInfo = useCallback(() => {
    const backup = localStorage.getItem('siteContent_backup');
    if (backup) {
      try {
        const data = JSON.parse(backup);
        return {
          exists: true,
          size: new Blob([backup]).size,
          items: Object.keys(data).length
        };
      } catch {
        return { exists: false, size: 0, items: 0 };
      }
    }
    return { exists: false, size: 0, items: 0 };
  }, []);

  return {
    forceSave,
    exportContent,
    importContent,
    resetContent,
    getBackupInfo
  };
};
