import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Star, MapPin, Clock, Phone, CheckCircle } from "lucide-react";
import { getUrgencyBonus } from "../utils/matching";

export default function MatchResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, acceptRequest, currentUser } = useApp();
  const request = requests.find((r) => r.id === id && r.ownerEmail === currentUser?.email);

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Request not found.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">← Go Home</Link>
      </div>
    );
  }

  const handleSelectProvider = (providerId) => {
    if (acceptRequest(id, providerId)) navigate(`/tracking/${id}`);
  };

  const handleAutoAssign = () => {
    const bestProvider = request.matchedProviders?.[0];
    if (bestProvider) handleSelectProvider(bestProvider.id);
  };

  return (
    <div className="page-wrap max-w-4xl">
      <p className="eyebrow">Your perfect match</p>
      <h1 className="page-title text-4xl">Recommended Providers</h1>
      <p className="page-subtitle mb-10">
        For <span className="font-medium">{request.serviceName}</span> in {request.location}
      </p>
      <div className="surface p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{request.urgency}</span> priority adds{" "}
          <span className="font-semibold text-indigo-600">+{getUrgencyBonus(request.urgency)} points</span> to every match.
        </p>
        {request.status === "Requested" && request.matchedProviders?.length > 0 && (
          <button onClick={handleAutoAssign} className="primary-button px-4 py-2 rounded-xl text-sm font-semibold">
            Auto Assign Best Provider
          </button>
        )}
      </div>

      {request.status !== "Requested" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800 text-sm">
            Provider already selected. Status: <strong>{request.status}</strong>
          </p>
        </div>
      )}

      <div className="space-y-4">
        {request.matchedProviders?.length ? request.matchedProviders.map((provider, index) => (
          <div
            key={provider.id}
            className="surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 transition"
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
                  <MapPin size={14} /> {provider.distance} km away
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> Available: {request.preferredTime}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {provider.phone}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Match Score: <span className="font-medium text-green-600">{provider.matchScore}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(provider.matchReasons || []).slice(0, 4).map((reason) => (
                  <span key={reason} className="text-xs rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
                    ✓ {reason}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-2">{provider.priceRange}</p>
              {request.status === "Requested" ? (
                <button
                  onClick={() => handleSelectProvider(provider.id)}
                  className="primary-button text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Select Provider
                </button>
              ) : request.assignedProviderId === provider.id ? (
                <span className="text-green-600 text-sm font-medium">Selected</span>
              ) : null}
            </div>
          </div>
        )) : (
          <div className="surface p-8 text-center">
            <h2 className="font-semibold text-gray-900">No providers are available yet</h2>
            <p className="text-sm text-gray-500 mt-2">
              Try another service or submit this request again later.
            </p>
            <Link to="/" className="primary-button mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold">
              Request another service
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Request another service
        </Link>
        {request.status !== "Requested" && (
          <Link to={`/tracking/${id}`} className="text-blue-600 hover:underline text-sm">
            Track this request →
          </Link>
        )}
      </div>
    </div>
  );
}