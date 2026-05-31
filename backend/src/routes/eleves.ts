import express from "express";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const eleves = await prisma.eleve.findMany({
    include: {
      classe: true,
      parent: {
        select: {
          id: true,
          nom: true,
          email: true
        }
      }
    }
  });
  res.json(eleves);
});

router.post("/", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  const { nom, dateNaissance, classeId, parentId } = req.body;
  if (!nom || !dateNaissance || !classeId || !parentId) {
    return res.status(400).json({ message: "Informations manquantes" });
  }

  const eleve = await prisma.eleve.create({
    data: {
      nom,
      dateNaissance: new Date(dateNaissance),
      classeId,
      parentId
    }
  });
  res.status(201).json(eleve);
});

export default router;
