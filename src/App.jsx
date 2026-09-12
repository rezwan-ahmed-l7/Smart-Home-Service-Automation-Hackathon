import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Home, Wrench, User, ClipboardList, LogIn, LogOut } from "lucide-react";
import CustomerHome from "./pages/CustomerHome";
import MatchResult from "./pages/MatchResult";
import ProviderDashboard from "./pages/ProviderDashboard";
import Tracking from "./pages/Tracking";
import MyRequests from "./pages/MyRequests";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import { useApp } from "./context/AppContext";

function Navbar() {
  const location = useLocation();
  const { currentUser, logout, toast } = useApp();
  const isCustomer = currentUser?.role === "customer";
  const isProvider = currentUser?.role === "provider";
  const isPublicLanding = location.pathname === "/" && !currentUser;
  if (isPublicLanding) {
    return (
      <nav className="site-header">
        <div className="header-inner flex items-center justify-between">
          <Link to="/" className="brand-mark">
            <span className="brand-icon"><Wrench size={19} /></span>
            Smart Home <span className="text-indigo-600">Service</span>
          </Link>
          <Link to="/login" className="primary-button px-4 py-2 rounded-xl text-sm font-semibold">
            <LogIn size={16} /> Sign in
          </Link>
        </div>
      </nav>
    );
  }
  return (
    <nav className="site-header">
      <div className="header-inner flex items-center justify-between">
        <Link to="/" className="brand-mark">
          <span className="brand-icon"><Wrench size={19} /></span>
          Smart Home <span className="text-indigo-600">Service</span>
        </Link>
        <div className="flex items-center gap-1">
          {isCustomer && (
            <>
              <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                <Home size={18} /> Home
              </Link>
              <Link to="/my-requests" className={`nav-link ${location.pathname === "/my-requests" ? "active" : ""}`}>
                <ClipboardList size={18} /> My Requests
              </Link>
            </>
          )}
          {isProvider && (
            <Link to="/provider" className={`nav-link ${location.pathname === "/provider" ? "active" : ""}`}>
              <User size={18} /> Provider
            </Link>
          )}
          {currentUser ? (
            <button type="button" onClick={logout} className="nav-link" title={`Sign out ${currentUser.username}`}>
              <LogOut size={18} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>
              <LogIn size={18} /> Sign in
            </Link>
          )}
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}
    </nav>
  );
}

function HomeRoute() {
  const { currentUser } = useApp();
  return currentUser ? <ProtectedRoute role="customer"><CustomerHome /></ProtectedRoute> : <Landing />;
}

function ProtectedRoute({ role, children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === "provider" ? "/provider" : "/"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<HomeRoute />} />
            <Route path="/match/:id" element={<ProtectedRoute role="customer"><MatchResult /></ProtectedRoute>} />
            <Route path="/tracking/:id" element={<ProtectedRoute role="customer"><Tracking /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute role="customer"><MyRequests /></ProtectedRoute>} />
            <Route path="/provider" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}