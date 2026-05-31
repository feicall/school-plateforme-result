import { useNavigate } from "react-router-dom";
import { clearToken, getUserName, getUserEmail, getUserRole } from "../utils/auth";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const userName = getUserName() || "Utilisateur";
  const userEmail = getUserEmail() || "email@exemple.com";
  const userRole = getUserRole() || "VISITEUR";

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  // Initiales pour l'avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Couleurs de badge par rôle
  const roleColors: any = {
    ADMIN: "bg-red-100 text-red-600 border-red-200",
    ENSEIGNANT: "bg-indigo-100 text-indigo-600 border-indigo-200",
    PARENT: "bg-emerald-100 text-emerald-600 border-emerald-200",
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Section Titre */}
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{subtitle}</p>}
        </div>

        {/* Section Profil & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <p className="text-sm font-bold text-slate-900">{userName}</p>
            <p className="text-xs font-medium text-slate-500">{userEmail}</p>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
            {/* Badge Rôle */}
            <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${roleColors[userRole] || "bg-slate-100 text-slate-600"}`}>
              {userRole}
            </span>

            {/* Avatar Représentation */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-200">
              {initials}
            </div>

            {/* CTA Déconnexion */}
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Se déconnecter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
