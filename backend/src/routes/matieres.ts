import express from "express";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const matieres = await prisma.matiere.findMany();
  res.json(matieres);
});

router.post("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ message: "Le nom de la matière est requis." });
  }
  const matiere = await prisma.matiere.create({ data: { nom } });
  res.status(201).json(matiere);
});

export default router;
