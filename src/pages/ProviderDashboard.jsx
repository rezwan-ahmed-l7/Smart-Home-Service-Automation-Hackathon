import { useApp } from "../context/AppContext";
import { Clock, MapPin, Phone, User, CheckCircle, Truck, Play, Check } from "lucide-react";

const statusFlow = ["Requested", "Accepted", "On the Way", "In Progress", "Completed"];

export default function ProviderDashboard() {
  const { requests, updateRequestStatus, acceptRequest, providers } = useApp();

  // Show only requests that are still open or assigned
  const incomingRequests = requests.filter(
    (r) => r.status === "Requested" || r.status === "Accepted" || r.status === "On the Way" || r.status === "In Progress"
  );

  const handleAccept = (requestId) => {
    // For demo, assign first matched provider or a default one
    const request = requests.find((r) => r.id === requestId);
    const providerId = request?.matchedProviders?.[0]?.id || providers[0]?.id;
    acceptRequest(requestId, providerId);
  };

  const handleStatusUpdate = (requestId, currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      updateRequestStatus(requestId, statusFlow[currentIndex + 1]);
    }
  };

  const getNextStatusLabel = (status) => {
    const map = {
      Requested: "Accept Job",
      Accepted: "Mark On the Way",
      "On the Way": "Start Work",
      "In Progress": "Mark Completed",
    };
    return map[status] || "Update";
  };

  return (
    <div className="page-wrap max-w-5xl">
      <div className="mb-8">
        <p className="eyebrow">Professional workspace</p>
        <h1 className="page-title text-4xl">Provider Dashboard</h1>
        <p className="page-subtitle mt-2">Manage incoming service requests with confidence.</p>
      </div>

      {incomingRequests.length === 0 ? (
        <div className="surface p-12 text-center">
          <p className="text-gray-500">No incoming requests right now.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {incomingRequests.map((req) => (
            <div key={req.id} className="surface p-6 sm:p-7">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{req.serviceName}</h3>
                  <p className="text-sm text-gray-500">Request ID: {req.id.slice(-6)}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === "Requested"
                      ? "bg-yellow-50 text-yellow-700"
                      : req.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                  <User size={16} /> {req.contactName}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {req.contactPhone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> {req.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {req.preferredDate} • {req.preferredTime}
                </div>
              </div>

              {req.problemDetails && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-5">
                  {req.problemDetails}
                </p>
              )}

              {/* Urgency */}
              <div className="mb-5">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                    req.urgency === "Emergency"
                      ? "bg-red-100 text-red-700"
                      : req.urgency === "Urgent"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {req.urgency}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {req.status === "Requested" && (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="primary-button text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                    >
                      <CheckCircle size={16} /> Accept Job
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, "Rejected")}
                      className="border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {["Accepted", "On the Way", "In Progress"].includes(req.status) && (
                  <button
                    onClick={() => handleStatusUpdate(req.id, req.status)}
                    className="primary-button text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    {req.status === "Accepted" && <Truck size={16} />}
                    {req.status === "On the Way" && <Play size={16} />}
                    {req.status === "In Progress" && <Check size={16} />}
                    {getNextStatusLabel(req.status)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}