import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Clock, MapPin, ChevronRight } from "lucide-react";

export default function MyRequests() {
  const { requests, currentUser } = useApp();

  const sorted = requests.filter((request) => request.ownerEmail && request.ownerEmail === currentUser.email).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="page-wrap max-w-4xl">
      <p className="eyebrow">Your activity</p>
      <h1 className="page-title text-4xl">My Requests</h1>
      <p className="page-subtitle mb-10">Track every service request from one calm, clear dashboard.</p>

      {sorted.length === 0 ? (
        <div className="surface p-12 text-center">
          <p className="text-gray-500 mb-4">No requests yet.</p>
          <Link
            to="/"
            className="primary-button px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            Request a Service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((req) => (
            <Link
              key={req.id}
              to={`/tracking/${req.id}`}
              className="surface block p-5 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{req.serviceName}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {req.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {req.preferredDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      req.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : req.status === "Requested"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}