import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CheckCircle, Circle, MapPin, Clock, User, Phone } from "lucide-react";

const statusSteps = ["Requested", "Accepted", "On the Way", "In Progress", "Completed"];

export default function Tracking() {
  const { id } = useParams();
  const { requests, providers } = useApp();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Request not found.</p>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          ← Go Home
        </Link>
      </div>
    );
  }

  const currentIndex = statusSteps.indexOf(request.status);
  const assignedProvider = providers.find((p) => p.id === request.assignedProviderId);

  return (
    <div className="page-wrap max-w-3xl">
      <p className="eyebrow">Live service status</p>
      <h1 className="page-title text-4xl">Track Your Request</h1>
      <p className="page-subtitle mb-10">
        {request.serviceName} • {request.location}
      </p>

      {/* Status Timeline */}
      <div className="surface p-6 sm:p-7 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Status</h2>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>
                  {isCurrent && <p className="text-xs text-gray-500">Current status</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Request Details */}
      <div className="surface p-6 sm:p-7 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Request Details</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User size={16} /> {request.contactName} • {request.contactPhone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {request.location}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} /> {request.preferredDate} at {request.preferredTime}
          </div>
          <div>
            Urgency: <span className="font-medium">{request.urgency}</span>
          </div>
          {request.problemDetails && (
            <p className="bg-gray-50 rounded-xl p-3 mt-2">{request.problemDetails}</p>
          )}
        </div>
      </div>

      {/* Assigned Provider */}
      {assignedProvider && (
        <div className="surface p-6 sm:p-7 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Assigned Provider</h2>
          <div>
            <p className="font-medium text-gray-900">{assignedProvider.name}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Phone size={14} /> {assignedProvider.phone}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Rating: {assignedProvider.rating} • {assignedProvider.distance} km away
            </p>
          </div>
        </div>
      )}

      {/* Rating (only when Completed) */}
      {request.status === "Completed" && (
        <div className="surface p-6 sm:p-7 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Rate this service</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-2xl text-yellow-400 hover:scale-110 transition"
                onClick={() => alert(`Thanks for rating ${star} stars!`)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Back to Home
      </Link>
    </div>
  );
}