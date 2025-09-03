import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleImageUpload, handleGetImages } from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' })); // Augmenter la limite pour les images
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Servir les fichiers statiques depuis public
  app.use(express.static('public'));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Routes d'upload d'images
  app.post("/api/upload/image", handleImageUpload);
  app.get("/api/upload/images", handleGetImages);

  return app;
}
