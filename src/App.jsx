import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Home, Wrench, User } from "lucide-react";

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

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Home Service</h1>
      <p className="text-gray-600 mb-8">Request any home service in seconds. We match the best provider for you.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <p className="text-blue-800 font-medium">Service Selection page coming next...</p>
      </div>
    </div>
  );
}

function ProviderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
      <p className="text-gray-600">Incoming requests will show here.</p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/provider" element={<ProviderPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}