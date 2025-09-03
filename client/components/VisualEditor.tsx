import React, { useState, useRef, useEffect } from 'react';
import { Edit, Check, X, Type, Palette, Image, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface VisualEditorProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  contentKey,
  defaultValue,
  className = '',
  as: Component = 'div',
  placeholder,
  multiline = false,
  editable = true,
}) => {
  const { isAdmin, getContent, updateContent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getContent(contentKey, defaultValue);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (!isAdmin || !editable) return;
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateContent(contentKey, editValue);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      saveEdit();
    }
  };

  if (!isAdmin) {
    return (
      <Component className={className}>
        {currentValue || placeholder}
      </Component>
    );
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 rounded-md px-3 py-2 resize-none min-h-[100px] w-full bg-white shadow-lg`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 rounded-md px-3 py-2 w-full bg-white shadow-lg`}
            placeholder={placeholder}
          />
        )}
        
        <div className="absolute -right-20 top-0 flex flex-col gap-1 bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={saveEdit}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Sauvegarder (Ctrl+Enter)"
          >
            <Check size={14} />
          </button>
          <button
            onClick={cancelEdit}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Annuler (Escape)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        className={`${className} ${editable ? 'cursor-pointer transition-all duration-200' : ''} ${
          isHovered && editable ? 'outline outline-2 outline-blue-300 outline-offset-2 bg-blue-50/50' : ''
        }`}
        onClick={startEditing}
      >
        {currentValue || placeholder}
      </Component>
      
      {isHovered && editable && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button
            onClick={startEditing}
            className="p-1 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Éditer ce contenu"
          >
            <Edit size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
