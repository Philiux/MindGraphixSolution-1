import React from "react";

interface ChatManagerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ChatManager: React.FC<ChatManagerProps> = ({
  isOpen,
  setIsOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Chat Manager</h2>
        <p className="text-gray-600 mb-4">
          Cette fonctionnalité est en cours de développement.
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ChatManager;
