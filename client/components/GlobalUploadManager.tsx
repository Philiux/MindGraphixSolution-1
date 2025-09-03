import React, { useState, useEffect } from 'react';
import { Upload, Image, File, Trash2, Copy, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: 'image' | 'document' | 'other';
  uploadDate: string;
}

export const GlobalUploadManager: React.FC = () => {
  const { isAdmin } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isAdmin) return null;

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    setFiles(savedFiles);
  };

  const handleFileUpload = async (fileList: FileList) => {
    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const dataUrl = await readFileAsDataURL(file);
        
        // Déterminer le type de fichier
        let fileType: 'image' | 'document' | 'other' = 'other';
        if (file.type.startsWith('image/')) {
          fileType = 'image';
        } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
          fileType = 'document';
        }

        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + '_' + i,
          name: file.name,
          url: dataUrl,
          size: file.size,
          type: fileType,
          uploadDate: new Date().toISOString()
        };

        newFiles.push(uploadedFile);
      } catch (error) {
        console.error('Erreur upload fichier:', file.name, error);
      }
    }

    // Sauvegarder les nouveaux fichiers
    const allFiles = [...files, ...newFiles];
    setFiles(allFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(allFiles));
    setIsUploading(false);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const deleteFile = (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiée dans le presse-papier !');
  };

  const downloadFile = (file: UploadedFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'document':
        return <File size={16} className="text-green-500" />;
      default:
        return <File size={16} className="text-gray-500" />;
    }
  };

  const getFileTypeCount = (type: string) => {
    return files.filter(f => f.type === type).length;
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Upload size={20} className="mr-2" />
          Gestionnaire de Fichiers ({files.length})
        </h3>
        <div className="text-sm text-gray-500">
          Total: {formatFileSize(getTotalSize())}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <Image size={24} className="mx-auto mb-1 text-blue-500" />
          <div className="text-lg font-bold text-blue-700">{getFileTypeCount('image')}</div>
          <div className="text-xs text-blue-600">Images</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <File size={24} className="mx-auto mb-1 text-green-500" />
          <div className="text-lg font-bold text-green-700">{getFileTypeCount('document')}</div>
          <div className="text-xs text-green-600">Documents</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <Upload size={24} className="mx-auto mb-1 text-gray-500" />
          <div className="text-lg font-bold text-gray-700">{getFileTypeCount('other')}</div>
          <div className="text-xs text-gray-600">Autres</div>
        </div>
      </div>

      {/* Zone d'upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload size={48} className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          {dragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
        </h4>
        <p className="text-gray-500 mb-4">
          Ou cliquez pour sélectionner des fichiers
        </p>
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button className="cursor-pointer" disabled={isUploading}>
            {isUploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
          </Button>
        </label>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Fichiers uploadés</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => copyUrl(file.url)}
                    size="sm"
                    variant="outline"
                    title="Copier l'URL"
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    onClick={() => downloadFile(file)}
                    size="sm"
                    variant="outline"
                    title="Télécharger"
                  >
                    <Download size={14} />
                  </Button>
                  <Button
                    onClick={() => deleteFile(file.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conseils */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-yellow-800 mb-1">Conseils d'utilisation :</div>
            <ul className="text-yellow-700 space-y-1">
              <li>• Les fichiers sont stockés localement dans votre navigateur</li>
              <li>• Images supportées : JPG, PNG, GIF, WebP</li>
              <li>• Documents supportés : PDF, DOC, TXT</li>
              <li>• Taille maximale recommandée : 10MB par fichier</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
