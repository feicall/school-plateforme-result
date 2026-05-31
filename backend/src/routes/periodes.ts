import express from "express";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const periodes = await prisma.periode.findMany();
  res.json(periodes);
});

router.post("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { libelle } = req.body;
  if (!libelle) {
    return res.status(400).json({ message: "Le libellé est requis." });
  }
  const periode = await prisma.periode.create({ data: { libelle } });
  res.status(201).json(periode);
});

export default router;
