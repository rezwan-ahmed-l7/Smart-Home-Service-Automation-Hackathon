import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Home, Wrench, User, ClipboardList, LogIn, LogOut } from "lucide-react";
import CustomerHome from "./pages/CustomerHome";
import MatchResult from "./pages/MatchResult";
import ProviderDashboard from "./pages/ProviderDashboard";
import Tracking from "./pages/Tracking";
import MyRequests from "./pages/MyRequests";
import Login from "./pages/Login";
import { useApp } from "./context/AppContext";

function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useApp();
  return (
    <nav className="site-header">
      <div className="header-inner flex items-center justify-between">
        <Link to="/" className="brand-mark">
          <span className="brand-icon"><Wrench size={19} /></span>
          Smart<span className="text-indigo-600">Service</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            <Home size={18} /> Home
          </Link>
          <Link to="/my-requests" className={`nav-link ${location.pathname === "/my-requests" ? "active" : ""}`}>
            <ClipboardList size={18} /> My Requests
          </Link>
          <Link to="/provider" className={`nav-link ${location.pathname === "/provider" ? "active" : ""}`}>
            <User size={18} /> Provider
          </Link>
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
    </nav>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<CustomerHome />} />
            <Route path="/match/:id" element={<MatchResult />} />
            <Route path="/tracking/:id" element={<Tracking />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/provider" element={<ProviderDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}