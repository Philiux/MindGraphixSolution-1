import React, { useState, useRef, useEffect } from "react";
import { Edit, Check, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  placeholder?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  className = "",
  as: Component = "div",
  placeholder,
  multiline = false,
}) => {
  const { isAdmin, isSuperAdmin, isEditMode, getContent, updateContent } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentValue = getContent(contentKey, defaultValue);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (!isAdmin || (!isEditMode && !isSuperAdmin)) return;
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
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    } else if (e.key === "Enter" && e.ctrlKey && multiline) {
      saveEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-primary rounded-md px-2 py-1 resize-none min-h-[100px] w-full`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-primary rounded-md px-2 py-1 w-full`}
            placeholder={placeholder}
          />
        )}
        <div className="absolute -right-16 top-0 flex flex-col gap-1">
          <button
            onClick={saveEdit}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Sauvegarder (Ctrl+Enter)"
          >
            <Check size={14} />
          </button>
          <button
            onClick={cancelEdit}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Annuler (Escape)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${
        isAdmin && (isEditMode || isSuperAdmin)
          ? "relative group cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded-sm transition-all"
          : ""
      }`}
      onClick={startEditing}
    >
      {currentValue || placeholder}
      {isAdmin && (isEditMode || isSuperAdmin) && (
        <Edit
          size={16}
          className={`absolute -top-2 -right-2 ${isSuperAdmin ? "bg-red-500" : "bg-blue-500"} text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      )}
    </Component>
  );
};
