import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleImageUpload: RequestHandler = async (req, res) => {
  try {
    console.log("Upload request received");

    // Vérifier si l'utilisateur est un super admin (dev mode simple)
    const authHeader = req.headers.authorization as string | undefined;
    if (!authHeader || !authHeader.startsWith('SuperAdmin ')) {
      console.log("Unauthorized access attempt");
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const imageData = req.body.imageData;
    const originalFileName = req.body.fileName || `image_${Date.now()}.png`;

    if (!imageData) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    // Vérification du format base64 et du mime
    const base64Match = (imageData || '').match(/^data:([a-zA-Z0-9/+.]+);base64,(.*)$/);
    if (!base64Match) return res.status(400).json({ error: 'Format d\'image invalide' });

    const mime = base64Match[1];
    const dataPart = base64Match[2];

    const allowed = ['image/png','image/jpeg','image/jpg','image/gif','application/pdf'];
    if (!allowed.includes(mime)) {
      return res.status(400).json({ error: 'Type de fichier non autorisé' });
    }

    const buffer = Buffer.from(dataPart, 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2,10)}_${safeName}`;
    const filePath = path.join(uploadsDir, unique);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${unique}`;
    console.log('Image uploaded successfully:', imageUrl);
    res.json({ success: true, url: imageUrl, message: 'Image uploadée avec succès' });

  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
};

export const handleGetImages: RequestHandler = (req, res) => {
  try {
    const uploadsDir = "./public/uploads";

    if (!fs.existsSync(uploadsDir)) {
      return res.json({ images: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        name: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadsDir, file)).size
      }));

    res.json({ images });
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
