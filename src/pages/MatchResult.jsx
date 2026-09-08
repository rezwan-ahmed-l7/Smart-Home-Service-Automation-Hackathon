import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Star, MapPin, Clock, Phone } from "lucide-react";

export default function MatchResult() {
  const { id } = useParams();
  const { requests } = useApp();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Request not found.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">← Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Recommended Providers</h1>
      <p className="text-gray-600 mb-8">
        For <span className="font-medium">{request.serviceName}</span> in {request.location}
      </p>

      <div className="space-y-4">
        {request.matchedProviders?.map((provider, index) => (
          <div
            key={provider.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" /> {provider.rating} ({provider.reviews})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {provider.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {provider.availableSlots[0]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Match Score: <span className="font-medium text-green-600">{provider.matchScore}</span></p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{provider.priceRange}</p>
              <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                Select Provider
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="inline-block mt-8 text-blue-600 hover:underline">
        ← Request another service
      </Link>
    </div>
  );
}