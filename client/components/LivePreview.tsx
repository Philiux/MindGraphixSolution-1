import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from './ui/button';

interface LivePreviewProps {
  url: string;
  className?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ url, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const refresh = () => {
    setIsLoading(true);
    setLastRefresh(Date.now());
    setTimeout(() => setIsLoading(false), 1000);
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  const getFrameStyle = () => {
    switch (viewMode) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          maxWidth: '100%'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          maxWidth: '100%'
        };
      default:
        return {
          width: '100%',
          height: '100%'
        };
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Aperçu en direct</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {url}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vue Desktop"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tablet' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vue Tablet"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Vue Mobile"
              >
                <Smartphone size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            <Button
              onClick={refresh}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualiser</span>
            </Button>

            <Button
              onClick={openInNewTab}
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ExternalLink size={14} />
              <span>Nouvel onglet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full flex items-center justify-center">
          {viewMode !== 'desktop' ? (
            // Mobile/Tablet frame
            <div 
              className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden"
              style={getFrameStyle()}
            >
              <iframe
                key={lastRefresh}
                src={url}
                className="w-full h-full border-0"
                title="Site Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          ) : (
            // Desktop frame
            <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
              <iframe
                key={lastRefresh}
                src={url}
                className="w-full h-full border-0"
                title="Site Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Dernière actualisation: {new Date(lastRefresh).toLocaleTimeString()}</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>En ligne</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Mode: {viewMode}</span>
            <span>Résolution: {getFrameStyle().width} × {getFrameStyle().height}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
