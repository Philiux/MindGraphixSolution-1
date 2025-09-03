import React from "react";
import Logo from "../components/Logo";

export default function Test() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-xl">
          Si vous voyez cette page, le serveur fonctionne !
        </p>
        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p>Timestamp: {new Date().toLocaleString()}</p>
        </div>

        {/* Test des logos */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Test des Logos</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <Logo size="sm" />
              <p className="text-sm mt-2">Petit</p>
            </div>
            <div className="text-center">
              <Logo size="md" />
              <p className="text-sm mt-2">Moyen</p>
            </div>
            <div className="text-center">
              <Logo size="lg" />
              <p className="text-sm mt-2">Grand</p>
            </div>
            <div className="text-center">
              <Logo size="xl" />
              <p className="text-sm mt-2">Très grand</p>
            </div>
          </div>
          <div className="mt-4">
            <Logo size="md" showText={true} className="justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
