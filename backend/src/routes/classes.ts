import express from "express";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const classes = await prisma.classe.findMany({
    include: { eleves: true }
  });
  res.json(classes);
});

router.post("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom } = req.body;
  if (!nom) {
    return res.status(400).json({ message: "Le nom de la classe est requis." });
  }
  const classe = await prisma.classe.create({ data: { nom } });
  res.status(201).json(classe);
});

export default router;
