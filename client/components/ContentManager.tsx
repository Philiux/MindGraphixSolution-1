import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Copy,
  Eye,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface ContentItem {
  key: string;
  value: any;
  type: "text" | "image" | "object" | "array";
  category: string;
  lastModified: string;
}

export const ContentManager: React.FC = () => {
  const { isSuperAdmin, getContent, updateContent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadAllContent();
    }
  }, [isOpen]);

  if (!isSuperAdmin) return null;

  const loadAllContent = () => {
    const siteContent = JSON.parse(localStorage.getItem("siteContent") || "{}");
    const items: ContentItem[] = [];

    const processObject = (obj: any, prefix: string = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          processObject(value, fullKey);
        } else {
          const type = Array.isArray(value)
            ? "array"
            : typeof value === "string" && value.includes("http")
              ? "image"
              : typeof value === "object"
                ? "object"
                : "text";

          const category = fullKey.split(".")[0] || "general";

          items.push({
            key: fullKey,
            value,
            type,
            category,
            lastModified: new Date().toISOString(),
          });
        }
      });
    };

    processObject(siteContent);
    setContentItems(items);
  };

  const filteredItems = contentItems.filter((item) => {
    const matchesSearch =
      (item.key || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.value || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(contentItems.map((item) => item.category))),
  ];

  const startEditing = (item: ContentItem) => {
    setEditingItem(item);
    setEditValue(
      typeof item.value === "object"
        ? JSON.stringify(item.value, null, 2)
        : String(item.value),
    );
  };

  const saveEdit = () => {
    if (!editingItem) return;

    let newValue = editValue;
    if (editingItem.type === "object" || editingItem.type === "array") {
      try {
        newValue = JSON.parse(editValue);
      } catch (e) {
        alert("Format JSON invalide");
        return;
      }
    }

    updateContent(editingItem.key, newValue);
    setEditingItem(null);
    setEditValue("");
    loadAllContent();
  };

  const deleteItem = (key: string) => {
    if (confirm(`Supprimer définitivement "${key}" ?`)) {
      updateContent(key, undefined);
      loadAllContent();
    }
  };

  const duplicateItem = (item: ContentItem) => {
    const newKey = `${item.key}_copy`;
    updateContent(newKey, item.value);
    loadAllContent();
  };

  const addNewItem = () => {
    const key = prompt("Clé du nouvel élément (ex: hero.newTitle):");
    if (key) {
      const value = prompt("Valeur:");
      if (value !== null) {
        updateContent(key, value);
        loadAllContent();
      }
    }
  };

  const exportContent = () => {
    const siteContent = localStorage.getItem("siteContent") || "{}";
    const blob = new Blob([siteContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          localStorage.setItem("siteContent", JSON.stringify(content));
          loadAllContent();
          alert("Contenu importé avec succès !");
        } catch (error) {
          alert("Erreur lors de l'importation du contenu");
        }
      };
      reader.readAsText(file);
    }
  };

  const getValuePreview = (value: any, type: string) => {
    if (type === "image") {
      return (
        <div className="flex items-center space-x-2">
          <img
            src={value}
            alt="Preview"
            className="w-8 h-8 object-cover rounded"
          />
          <span className="text-xs text-gray-500 truncate max-w-xs">
            {value}
          </span>
        </div>
      );
    }

    if (type === "object" || type === "array") {
      return (
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
          {JSON.stringify(value).length > 50
            ? JSON.stringify(value).substring(0, 50) + "..."
            : JSON.stringify(value)}
        </span>
      );
    }

    return (
      <span className="text-sm truncate max-w-xs">
        {String(value).length > 100
          ? String(value).substring(0, 100) + "..."
          : String(value)}
      </span>
    );
  };

  return (
    <>
      {/* Content Manager Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Gestionnaire de Contenu"
      >
        <FileText size={20} />
      </button>

      {/* Content Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={24} />
                  <h2 className="text-2xl font-bold">
                    Gestionnaire de Contenu
                  </h2>
                  <span className="px-2 py-1 bg-indigo-800 rounded-full text-xs font-bold">
                    {contentItems.length} éléments
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-indigo-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Rechercher dans le contenu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Toutes les catégories" : cat}
                    </option>
                  ))}
                </select>

                <div className="flex space-x-2">
                  <Button
                    onClick={addNewItem}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus size={16} className="mr-1" />
                    Ajouter
                  </Button>

                  <Button onClick={exportContent} size="sm" variant="outline">
                    <Download size={16} className="mr-1" />
                    Exporter
                  </Button>

                  <label>
                    <Button size="sm" variant="outline">
                      <Upload size={16} className="mr-1" />
                      Importer
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importContent}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              {editingItem ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Édition : {editingItem.key}
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={saveEdit}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Save size={16} className="mr-1" />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={() => setEditingItem(null)}
                        size="sm"
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur ({editingItem.type})
                    </label>
                    {editingItem.type === "text" ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={editValue.split("\n").length + 2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={Math.max(5, editValue.split("\n").length)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="Format JSON requis"
                      />
                    )}
                  </div>

                  {editingItem.type === "image" && editValue && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aperçu
                      </label>
                      <img
                        src={editValue}
                        alt="Preview"
                        className="max-w-xs h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300x200?text=Image+non+trouvée";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* List Mode */
                <div className="space-y-2">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-30" />
                      <p>Aucun contenu trouvé</p>
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                item.type === "text"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.type === "image"
                                    ? "bg-green-100 text-green-800"
                                    : item.type === "object"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {item.type}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="font-medium text-gray-900 truncate">
                              {item.key}
                            </div>
                            <div className="mt-1">
                              {getValuePreview(item.value, item.type)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => startEditing(item)}
                            size="sm"
                            variant="outline"
                            title="Éditer"
                          >
                            <Edit size={14} />
                          </Button>

                          <Button
                            onClick={() => duplicateItem(item)}
                            size="sm"
                            variant="outline"
                            title="Dupliquer"
                          >
                            <Copy size={14} />
                          </Button>

                          {item.type === "image" && (
                            <Button
                              onClick={() => window.open(item.value, "_blank")}
                              size="sm"
                              variant="outline"
                              title="Voir l'image"
                            >
                              <Eye size={14} />
                            </Button>
                          )}

                          <Button
                            onClick={() => deleteItem(item.key)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
