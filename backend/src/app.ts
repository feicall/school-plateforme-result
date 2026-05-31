import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import utilisateursRoutes from "./routes/utilisateurs";
import authRoutes from "./routes/auth";
import elevesRoutes from "./routes/eleves";
import classesRoutes from "./routes/classes";
import matieresRoutes from "./routes/matieres";
import periodesRoutes from "./routes/periodes";
import notesRoutes from "./routes/notes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});


app.get("/", (req, res) => {
  res.json({ message: "API Plateforme Résultats Scolaires" });
});

app.use("/api/auth", authRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/eleves", elevesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/matieres", matieresRoutes);
app.use("/api/periodes", periodesRoutes);
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});

export default app;
