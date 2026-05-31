import { FormEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import { api } from "../api/axios";

type Utilisateur = {
  id: number;
  nom: string;
  email: string;
  role: string;
};

type Classe = {
  id: number;
  nom: string;
};

type Eleve = {
  id: number;
  nom: string;
  classe: { nom: string };
  parent: { nom: string; email: string };
};

export default function DashboardAdmin() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<{ id: number; nom: string }[]>([]);
  const [periodes, setPeriodes] = useState<{ id: number; libelle: string }[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  
  // États pour les nouveaux éléments
  const [nouvelleClasse, setNouvelleClasse] = useState("");
  const [nouvelleMatiere, setNouvelleMatiere] = useState("");
  const [nouvellePeriode, setNouvellePeriode] = useState("");
  
  // États pour le nouvel élève
  const [nomEleve, setNomEleve] = useState("");
  const [dateNaisEleve, setDateNaisEleve] = useState("");
  const [classeIdEleve, setClasseIdEleve] = useState("");
  const [parentIdEleve, setParentIdEleve] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resClasses, resMatieres, resPeriodes, resUsers, resEleves] = await Promise.all([
        api.get("/classes"),
        api.get("/matieres"),
        api.get("/periodes"),
        api.get("/utilisateurs"),
        api.get("/eleves")
      ]);
      setClasses(resClasses.data);
      setMatieres(resMatieres.data);
      setPeriodes(resPeriodes.data);
      setUtilisateurs(resUsers.data);
      setEleves(resEleves.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreation = async (path: string, payload: any, clearFn?: () => void) => {
    try {
      await api.post(path, payload);
      if (clearFn) clearFn();
      fetchData();
    } catch (err) {
      alert("Erreur lors de la création");
    }
  };

  const handleCreerEleve = (e: FormEvent) => {
    e.preventDefault();
    if (!nomEleve || !dateNaisEleve || !classeIdEleve || !parentIdEleve) {
      return alert("Veuillez remplir tous les champs de l'élève");
    }
    handleCreation("/eleves", {
      nom: nomEleve,
      dateNaissance: dateNaisEleve,
      classeId: parseInt(classeIdEleve),
      parentId: parseInt(parentIdEleve)
    }, () => {
      setNomEleve("");
      setDateNaisEleve("");
      setClasseIdEleve("");
      setParentIdEleve("");
    });
  };

  // Filtrer les utilisateurs par rôle
  const parents = utilisateurs.filter(u => u.role === "PARENT");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Header 
          title="Console d'Administration" 
          subtitle="Gérez l'infrastructure scolaire en temps réel" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Utilisateurs" value={utilisateurs.length} color="blue" />
          <StatCard title="Élèves Inscrits" value={eleves.length} color="indigo" />
          <StatCard title="Classes" value={classes.length} color="emerald" />
          <StatCard title="Matières" value={matieres.length} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Section ÉLÈVES */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Liste des Élèves</h3>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                  {eleves.length} Total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Élève</th>
                      <th className="px-6 py-4">Classe</th>
                      <th className="px-6 py-4">Parent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {eleves.map((eleve) => (
                      <tr key={eleve.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{eleve.nom}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{eleve.classe?.nom}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{eleve.parent?.nom}</td>
                      </tr>
                    ))}
                    {eleves.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                          Aucun élève enregistré pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SimpleList title="Classes" data={classes} field="nom" />
              <SimpleList title="Matières" data={matieres} field="nom" />
              <SimpleList title="Périodes" data={periodes} field="libelle" />
            </div>
          </div>

          {/* Section ACTIONS */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Actions Rapides</h3>
            
            {/* Formulaire ÉLÈVE */}
            <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 space-y-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                 Nouvel Élève
              </h4>
              <form onSubmit={handleCreerEleve} className="space-y-3">
                <input
                  required
                  placeholder="Nom de l'élève"
                  value={nomEleve}
                  onChange={e => setNomEleve(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm outline-none focus:bg-white/20 transition"
                />
                <input
                  required
                  type="date"
                  value={dateNaisEleve}
                  onChange={e => setDateNaisEleve(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:bg-white/20 transition"
                />
                <select
                  required
                  value={classeIdEleve}
                  onChange={e => setClasseIdEleve(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:bg-white/20 transition"
                >
                  <option value="" className="text-slate-800">Choisir une classe</option>
                  {classes.map(c => <option key={c.id} value={c.id} className="text-slate-800">{c.nom}</option>)}
                </select>
                <select
                  required
                  value={parentIdEleve}
                  onChange={e => setParentIdEleve(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:bg-white/20 transition"
                >
                  <option value="" className="text-slate-800">Choisir un parent</option>
                  {parents.map(p => <option key={p.id} value={p.id} className="text-slate-800">{p.nom} ({p.email})</option>)}
                </select>
                <button type="submit" className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition">
                  Enregistrer l'élève
                </button>
              </form>
            </div>

            <ActionCard 
              label="Ajouter une Classe" 
              value={nouvelleClasse} 
              onChange={setNouvelleClasse} 
              onSubmit={() => handleCreation("/classes", { nom: nouvelleClasse }, () => setNouvelleClasse(""))} 
              placeholder="Ex: 6ème A"
            />

            <ActionCard 
              label="Ajouter une Matière" 
              value={nouvelleMatiere} 
              onChange={setNouvelleMatiere} 
              onSubmit={() => handleCreation("/matieres", { nom: nouvelleMatiere }, () => setNouvelleMatiere(""))} 
              placeholder="Ex: Mathématiques"
            />

            <ActionCard 
              label="Ajouter une Période" 
              value={nouvellePeriode} 
              onChange={setNouvellePeriode} 
              onSubmit={() => handleCreation("/periodes", { libelle: nouvellePeriode }, () => setNouvellePeriode(""))} 
              placeholder="Ex: Trimestre 1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants de style identiques
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function SimpleList({ title, data, field }: { title: string; data: any[]; field: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center p-3 rounded-xl bg-slate-50 text-sm font-medium text-slate-700">
            {item[field]}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionCard({ label, value, onChange, onSubmit, placeholder }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 outline-none text-sm"
        placeholder={placeholder}
      />
      <button 
        onClick={onSubmit}
        className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-sm"
      >
        Ajouter
      </button>
    </div>
  );
}
