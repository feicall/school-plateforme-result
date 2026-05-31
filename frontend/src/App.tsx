import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardParent from "./pages/DashboardParent";
import DashboardEnseignant from "./pages/DashboardEnseignant";
import { getToken, getUserRole } from "./utils/auth";

// Composant de redirection dynamique basé sur le rôle actuel
const DashboardDispatcher = () => {
  const token = getToken();
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  console.log("Dispatcher role detected:", role);

  switch (role) {
    case "ADMIN":
      return <DashboardAdmin />;
    case "ENSEIGNANT":
      return <DashboardEnseignant />;
    case "PARENT":
      return <DashboardParent />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardDispatcher />} />
        <Route
          path="*"
          element={<Navigate to={getToken() ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
