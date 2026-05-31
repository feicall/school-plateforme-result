import express from "express";
import prisma from "../prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const notes = await prisma.note.findMany({
    include: {
      eleve: true,
      matiere: true,
      periode: true,
      enseignant: {
        select: {
          id: true,
          nom: true,
          email: true
        }
      }
    }
  });
  res.json(notes);
});

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ENSEIGNANT", "ADMIN"),
  async (req, res) => {
    const { eleveId, matiereId, periodeId, enseignantId, note } = req.body;
    if (!eleveId || !matiereId || !periodeId || !enseignantId || note === undefined) {
      return res.status(400).json({ message: "Informations manquantes pour la note." });
    }

    const createdNote = await prisma.note.create({
      data: {
        eleveId,
        matiereId,
        periodeId,
        enseignantId,
        note: Number(note)
      }
    });
    res.status(201).json(createdNote);
  }
);

export default router;
