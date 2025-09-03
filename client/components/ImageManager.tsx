import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Eye, Copy, Download, Folder } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ImageItem {
  name: string;
  url: string;
  size: number;
}

export const ImageManager: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isSuperAdmin) return null;

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/upload/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    }
  };

  const uploadImage = async (file: File) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'SuperAdmin ' + localStorage.getItem('supremeAuth')
          },
          body: JSON.stringify({
            imageData: dataUrl,
            fileName: file.name
          })
        });

        if (response.ok) {
          await loadImages(); // Recharger la liste
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    alert('URL copiée dans le presse-papier !');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Image size={20} className="mr-2" />
          Gestionnaire d'Images
        </h3>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(uploadImage);
            }}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className={`inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <Upload size={16} className="mr-2" />
              {isLoading ? 'Upload...' : 'Ajouter Images'}
            </div>
          </label>
          <Button
            onClick={loadImages}
            variant="outline"
            size="sm"
          >
            Actualiser
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Folder size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aucune image uploadée</p>
          <p className="text-sm">Commencez par ajouter des images</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(image.url)}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {formatFileSize(image.size)}
                </p>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => copyImageUrl(image.url)}
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <Copy size={12} className="mr-1" />
                    Copier
                  </Button>
                  <Button
                    onClick={() => setSelectedImage(image.url)}
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <Eye size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de prévisualisation */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <img
              src={selectedImage}
              alt="Prévisualisation"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-100"
              size="sm"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
