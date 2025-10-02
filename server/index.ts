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

  // Quotes API
  import("./routes/quotes").then((mod) => {
    const { handleCreateQuote, handleListQuotes, handleReplyQuote } = mod;
    app.post("/api/quotes", handleCreateQuote);
    app.get("/api/quotes", handleListQuotes);
    app.post("/api/quotes/:id/reply", handleReplyQuote);
  }).catch((e) => console.error('Failed to load quotes routes', e));

  import("./routes/applications").then((mod) => {
    const { handleCreateApplication, handleListApplications } = mod;
    app.post("/api/applications", handleCreateApplication);
    app.get("/api/applications", handleListApplications);
  }).catch((e) => console.error('Failed to load applications routes', e));

  import("./routes/ai").then((mod) => {
    const { handleGeneratePdf } = mod;
    app.post("/api/ai/generate-pdf", handleGeneratePdf);
  }).catch((e) => console.error('Failed to load AI routes', e));

  return app;
}
