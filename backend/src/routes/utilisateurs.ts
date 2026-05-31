import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

// Lister les utilisateurs (sans les mots de passe)
router.get("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const utilisateurs = await prisma.utilisateur.findMany({
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  res.json(utilisateurs);
});

router.post("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  if (!nom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const utilisateurExistant = await prisma.utilisateur.findUnique({ where: { email } });
  if (utilisateurExistant) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  const nouvelUtilisateur = await prisma.utilisateur.create({
    data: { nom, email, mot_de_passe: hashedPassword, role }
  });
  res.status(201).json({
    id: nouvelUtilisateur.id,
    nom: nouvelUtilisateur.nom,
    email: nouvelUtilisateur.email,
    role: nouvelUtilisateur.role
  });
});

export default router;
