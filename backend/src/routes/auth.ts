import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";

const router = express.Router();

const validRoles = ["ADMIN", "ENSEIGNANT", "PARENT"];

router.post("/register", async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  if (!nom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide." });
  }

  try {
    const utilisateurExistant = await prisma.utilisateur.findUnique({ where: { email } });
    if (utilisateurExistant) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);
    const utilisateur = await prisma.utilisateur.create({
      data: { nom, email, mot_de_passe: motDePasseHash, role }
    });

    const token = generateToken({ 
      id: utilisateur.id, 
      role: utilisateur.role,
      nom: utilisateur.nom,
      email: utilisateur.email 
    });

    res.status(201).json({
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription. Vérifiez la connexion à la base de données." });
  }
});

router.post("/login", async (req, res) => {
  const { email, mot_de_passe } = req.body;
  console.log(`[AUTH] Tentative de connexion pour: ${email}`);
  
  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  try {
    console.log("[AUTH] Recherche de l'utilisateur dans la base...");
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    
    if (!utilisateur) {
      console.log("[AUTH] Utilisateur non trouvé.");
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    console.log("[AUTH] Utilisateur trouvé, vérification du mot de passe...");
    const isMatched = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    
    if (!isMatched) {
      console.log("[AUTH] Mot de passe incorrect.");
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    console.log("[AUTH] Mot de passe OK, génération du token...");
    const token = generateToken({ 
      id: utilisateur.id, 
      role: utilisateur.role,
      nom: utilisateur.nom,
      email: utilisateur.email 
    });

    
    console.log("[AUTH] Connexion réussie !");
    res.json({
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error("[AUTH] ERREUR CRITIQUE:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
});

export default router;
