import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { api } from "../api/axios";
import { getUserId } from "../utils/auth";

interface Eleve {
  id: number;
  nom: string;
  classe: { nom: string };
  parentId: number;
}

interface Note {
  id: number;
  eleveId: number;
  note: number;
  matiere: { id: number; nom: string };
  periode: { id: number; libelle: string };
}

interface Matiere {
  id: number;
  nom: string;
}

interface Periode {
  id: number;
  libelle: string;
}

export default function DashboardParent() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const userId = getUserId();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [resEleves, resNotes, resMat, resPer] = await Promise.all([
        api.get("/eleves"),
        api.get("/notes"),
        api.get("/matieres"),
        api.get("/periodes")
      ]);
      setEleves(resEleves.data.filter((e: Eleve) => e.parentId === userId));
      setNotes(resNotes.data);
      setMatieres(resMat.data);
      // On ne garde que les deux premières périodes pour le format Semestre 1 / 2
      setPeriodes(resPer.data.slice(0, 2));
    } catch (err) {
      console.error("Erreur chargement carnet", err);
    }
  };

  const bulletins = useMemo(() => {
    return eleves.map((eleve) => {
      const notesEleve = notes.filter((n) => n.eleveId === eleve.id);
      
      // Calcul des moyennes par période
      const moyennesPeriodes = periodes.map(p => {
        const notesP = notesEleve.filter(n => n.periode.id === p.id);
        const avg = notesP.length > 0 ? notesP.reduce((s, n) => s + n.note, 0) / notesP.length : null;
        return { id: p.id, avg };
      });

      // Moyenne Générale (Moyenne des moyennes existantes)
      const avgsExistantes = moyennesPeriodes.filter(m => m.avg !== null).map(m => m.avg as number);
      const moyenneGenerale = avgsExistantes.length > 0 
        ? avgsExistantes.reduce((s, a) => s + a, 0) / avgsExistantes.length 
        : null;

      return { eleve, moyennesPeriodes, moyenneGenerale };
    });
  }, [eleves, notes, periodes]);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-serif">
      <div className="max-w-5xl mx-auto space-y-12">
        <Header title="Bulletins de l'Année" subtitle="Suivi semestriel consolidé" />

        {bulletins.map(({ eleve, moyennesPeriodes, moyenneGenerale }) => (
          <div key={eleve.id} className="bg-white shadow-2xl rounded-sm border-t-8 border-slate-900 overflow-hidden">
            <div className="m-2 sm:m-6 p-4 sm:p-8 border-2 border-slate-200 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black uppercase underline decoration-4 underline-offset-8">{eleve.nom}</h2>
                <p className="mt-4 font-bold text-slate-500 uppercase tracking-widest text-sm">Classe : {eleve.classe?.nom}</p>
              </div>

              <div className="border-4 border-slate-900 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase text-xs tracking-widest">
                      <th className="border-r-4 border-slate-800 p-4 text-left">Matières</th>
                      {periodes.map(p => (
                        <th key={p.id} className="border-r-4 border-slate-800 p-4 text-center">{p.libelle}</th>
                      ))}
                      {/* Si pas de périodes créées */}
                      {periodes.length === 0 && (
                        <>
                          <th className="border-r-4 border-slate-800 p-4 text-center">Semestre 1</th>
                          <th className="border-r-4 border-slate-800 p-4 text-center">Semestre 2</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {matieres.map((mat) => (
                      <tr key={mat.id} className="border-t-2 border-slate-900 group">
                        <td className="border-r-4 border-slate-900 p-4 font-bold text-sm uppercase text-slate-800">
                          {mat.name || mat.nom}
                        </td>
                        {periodes.map(p => {
                          const note = notes.find(n => n.eleveId === eleve.id && n.matiere.id === mat.id && n.periode.id === p.id);
                          return (
                            <td key={p.id} className="border-r-4 border-slate-900 p-4 text-center font-black text-lg">
                              {note ? note.note.toFixed(2) : <span className="text-slate-200">—</span>}
                            </td>
                          );
                        })}
                        {/* Fallback si pas de périodes */}
                        {periodes.length === 0 && (
                          <>
                            <td className="border-r-4 border-slate-900 p-4 text-center text-slate-200">—</td>
                            <td className="border-r-4 border-slate-900 p-4 text-center text-slate-200">—</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {/* Moyennes Semestrielles */}
                    <tr className="border-t-4 border-slate-900 bg-slate-50 font-black">
                      <td className="p-4 text-right uppercase text-xs border-r-4 border-slate-900">Moyenne Semestrielle</td>
                      {moyennesPeriodes.map(m => (
                        <td key={m.id} className="p-4 text-center text-indigo-700 border-r-4 border-slate-900">
                          {m.avg !== null ? m.avg.toFixed(2) : "—"}
                        </td>
                      ))}
                      {periodes.length === 0 && (
                        <>
                          <td className="p-4 text-center border-r-4 border-slate-900">—</td>
                          <td className="p-4 text-center border-r-4 border-slate-900">—</td>
                        </>
                      )}
                    </tr>
                    {/* Moyenne Générale */}
                    <tr className="border-t-4 border-slate-900 bg-slate-900 text-white font-black">
                      <td className="p-4 text-right uppercase text-xs border-r-4 border-slate-800">Moyenne Générale Annuelle</td>
                      <td colSpan={Math.max(periodes.length, 2)} className="p-4 text-center text-2xl tracking-tighter">
                        {moyenneGenerale !== null ? (
                          <span className="bg-white text-slate-900 px-6 py-1 rounded-sm">
                            {moyenneGenerale.toFixed(2)} / 20
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-sm">Calculée en fin d'année</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-12 flex justify-between items-end gap-8 opacity-60 px-4">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-6">Signature des Parents</p>
                  <div className="w-40 h-px bg-slate-300"></div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase italic">Visa du Chef d'Établissement</p>
                  <div className="mt-2 w-32 h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase rotate-12">
                    Cachet Officiel
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {eleves.length === 0 && (
          <div className="bg-white p-20 rounded-3xl shadow-lg text-center space-y-6">
             <div className="text-6xl">📖</div>
             <h3 className="text-2xl font-black text-slate-900">Aucun élève rattaché</h3>
             <p className="text-slate-500">Dès que l'administration créera un lien, vous verrez le bulletin annuel ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
