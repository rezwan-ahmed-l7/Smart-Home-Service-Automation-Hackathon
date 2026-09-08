import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Clock, MapPin, ChevronRight } from "lucide-react";

export default function MyRequests() {
  const { requests } = useApp();

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Requests</h1>
      <p className="text-gray-600 mb-8">Track all your service requests</p>

      {sorted.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-500 mb-4">No requests yet.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
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
              className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition"
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