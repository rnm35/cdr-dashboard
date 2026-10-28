import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

function CheckingSession() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground" aria-busy="true">
      Checking your session...
    </div>
  );
}

// redirect to /login, remembering the page
function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "checking") return <CheckingSession />;
  if (status === "signedOut") return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function GuestRoute({ children }) {
  const { status } = useAuth();
  if (status === "checking") return <CheckingSession />;
  if (status === "signedIn") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
