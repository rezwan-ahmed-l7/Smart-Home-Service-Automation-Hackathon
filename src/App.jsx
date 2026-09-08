import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Home, Wrench, User } from "lucide-react";
import CustomerHome from "./pages/CustomerHome";
import MatchResult from "./pages/MatchResult";
import ProviderDashboard from "./pages/ProviderDashboard";
import Tracking from "./pages/Tracking";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Wrench size={24} />
          SmartService
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <Home size={18} /> Home
          </Link>
          <Link to="/provider" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <User size={18} /> Provider
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<CustomerHome />} />
            <Route path="/match/:id" element={<MatchResult />} />
            <Route path="/tracking/:id" element={<Tracking />} />
            <Route path="/provider" element={<ProviderDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}