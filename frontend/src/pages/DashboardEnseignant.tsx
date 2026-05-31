import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { api } from "../api/axios";
import { getUserId } from "../utils/auth";

interface Eleve {
  id: number;
  nom: string;
  classe: { nom: string };
}

interface Note {
  id: number;
  eleve: { id: number; nom: string };
  matiere: { id: number; nom: string };
  periode: { id: number; libelle: string };
  note: number;
  enseignant: { id: number };
}

export default function DashboardEnseignant() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [matieres, setMatieres] = useState<{ id: number; nom: string }[]>([]);
  const [periodes, setPeriodes] = useState<{ id: number; libelle: string }[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // État du formulaire de saisie
  const [eleveId, setEleveId] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [noteValeur, setNoteValeur] = useState("");
  
  const userId = getUserId();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resEleves, resMatieres, resPeriodes, resNotes] = await Promise.all([
        api.get("/eleves"),
        api.get("/matieres"),
        api.get("/periodes"),
        api.get("/notes")
      ]);
      setEleves(resEleves.data);
      setMatieres(resMatieres.data);
      setPeriodes(resPeriodes.data);
      setNotes(resNotes.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  const handleSaisieNote = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de soumission:", { eleveId, matiereId, periodeId, noteValeur });

    if (eleveId === "" || matiereId === "" || periodeId === "" || noteValeur === "") {
      return alert("Veuillez remplir tous les champs (Élève, Matière, Période et Note)");
    }

    try {
      await api.post("/notes", {
        eleveId: parseInt(eleveId),
        matiereId: parseInt(matiereId),
        periodeId: parseInt(periodeId),
        enseignantId: userId,
        note: parseFloat(noteValeur)
      });
      
      setNoteValeur("");
      fetchData();
      alert("Note enregistrée avec succès !");
    } catch (err) {
      alert("Erreur lors de l'enregistrement de la note. Vérifiez la connexion au serveur.");
    }
  };

  const notesDuProf = useMemo(() => {
    return notes.filter((n) => n.enseignant.id === userId);
  }, [notes, userId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Header 
          title="Portail Enseignant" 
          subtitle="Saisie des notes et suivi pédagogique" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORMULAIRE DE SAISIE */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-bold text-slate-800">Saisie de Note</h3>
              <form onSubmit={handleSaisieNote} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Choisir l'Élève</label>
                  <select 
                    value={eleveId} 
                    onChange={e => setEleveId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option value="">Sélectionner un élève</option>
                    {eleves.map(e => (
                      <option key={e.id} value={e.id}>{e.nom} ({e.classe.nom})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Matière</label>
                  <select 
                    value={matiereId} 
                    onChange={e => setMatiereId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option value="">Quelle matière ?</option>
                    {matieres.length === 0 && <option disabled>— Aucune matière créée par l'admin —</option>}
                    {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Période</label>
                    <select 
                      value={periodeId} 
                      onChange={e => setPeriodeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    >
                      <option value="">Période</option>
                      {periodes.length === 0 && <option disabled>— Créer des périodes en Admin —</option>}
                      {periodes.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Note / 20</label>
                    <input 
                      type="number" 
                      step="0.25" 
                      max="20"
                      min="0"
                      value={noteValeur}
                      onChange={e => setNoteValeur(e.target.value)}
                      placeholder="15.5"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition active:scale-95"
                >
                  Enregistrer la note
                </button>
              </form>
            </div>
          </div>

          {/* HISTORIQUE DES NOTES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Vos dernières saisies</h3>
                <span className="text-sm font-bold text-slate-500">{notesDuProf.length} notes au total</span>
              </div>
              <div className="divide-y divide-slate-50">
                {notesDuProf.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50/30 transition flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{n.eleve.nom}</h4>
                      <p className="text-sm text-slate-500">{n.matiere.nom} • {n.periode.libelle}</p>
                    </div>
                    <div className="text-2xl font-black text-indigo-600">
                      {n.note.toFixed(2)}
                    </div>
                  </div>
                ))}
                {notesDuProf.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic">
                    Vous n'avez pas encore saisi de notes.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
