import React, { useState } from "react";
import { Image, Upload, Save, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  contentKey,
  defaultSrc,
  alt,
  className = "",
  width,
  height,
}) => {
  const { isSuperAdmin, getContent, updateContent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);

  const currentSrc = getContent(contentKey, defaultSrc);

  const startEditing = () => {
    if (!isSuperAdmin) return;
    setNewUrl(currentSrc);
    setIsEditing(true);
  };

  const saveImage = () => {
    if (newUrl && newUrl !== currentSrc) {
      updateContent(contentKey, newUrl);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setNewUrl(currentSrc);
    setIsEditing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;

          try {
            // Essayer d'uploader vers le serveur
            const response = await fetch('/api/upload/image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'SuperAdmin ' + localStorage.getItem('supremeAuth')
              },
              body: JSON.stringify({
                imageData: dataUrl,
                fileName: `${contentKey}_${Date.now()}.${file.name.split('.').pop()}`
              })
            });

            if (response.ok) {
              const result = await response.json();
              setNewUrl(result.url);
            } else {
              // Fallback: utiliser directement le data URL
              setNewUrl(dataUrl);
            }
          } catch (error) {
            // Fallback: utiliser directement le data URL
            setNewUrl(dataUrl);
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        setIsUploading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <div className="bg-white border-2 border-red-500 rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold mb-3 text-red-600 flex items-center">
            <Image size={16} className="mr-2" />
            Modifier l'image
          </h4>

          <div className="space-y-3">
            {/* Toggle entre URL et fichier */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                onClick={() => setUploadMethod('url')}
                size="sm"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                className="flex-1"
              >
                Par URL
              </Button>
              <Button
                type="button"
                onClick={() => setUploadMethod('file')}
                size="sm"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                className="flex-1"
              >
                Fichier Local
              </Button>
            </div>

            {uploadMethod === 'url' ? (
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL de la nouvelle image"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                />
                {isUploading && (
                  <div className="text-sm text-blue-600 flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Upload en cours...
                  </div>
                )}
              </div>
            )}

            {newUrl && (
              <div className="relative">
                <img
                  src={newUrl}
                  alt="Aperçu"
                  className="max-w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x200?text=Erreur+URL";
                  }}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-sm font-medium">
                  Aperçu
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={saveImage}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save size={14} className="mr-1" />
                Sauvegarder
              </Button>
              <Button
                onClick={cancelEdit}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X size={14} className="mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${isSuperAdmin ? "cursor-pointer" : ""}`}
      onClick={startEditing}
    >
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${
          isSuperAdmin
            ? "hover:opacity-80 transition-opacity border-2 border-transparent hover:border-red-300"
            : ""
        }`}
        width={width}
        height={height}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultSrc;
        }}
      />

      {isSuperAdmin && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-red-500 text-white p-2 rounded-full">
            <Upload size={16} />
          </div>
        </div>
      )}
    </div>
  );
};
