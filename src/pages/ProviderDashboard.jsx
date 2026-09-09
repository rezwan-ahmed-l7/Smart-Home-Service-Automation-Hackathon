import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Clock, MapPin, Phone, User, CheckCircle, Truck, Play, Check, Search, SlidersHorizontal } from "lucide-react";
import GlassSelect from "../components/GlassSelect";

const statusFlow = ["Requested", "Accepted", "On the Way", "In Progress", "Completed"];

export default function ProviderDashboard() {
  const { requests, updateRequestStatus, acceptRequest, currentUser } = useApp();
  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("All");
  const [sort, setSort] = useState("newest");
  const providerRequests = requests.filter(
    (request) => request.assignedProviderId === currentUser.providerId ||
      (request.status === "Requested" && request.matchedProviders?.some((provider) => provider.id === currentUser.providerId))
  );

  const incomingRequests = useMemo(() => providerRequests
    .filter((request) => view === "active"
      ? ["Requested", "Accepted", "On the Way", "In Progress"].includes(request.status)
      : ["Completed", "Rejected"].includes(request.status))
    .filter((request) => urgency === "All" || request.urgency === urgency)
    .filter((request) => `${request.serviceName} ${request.contactName} ${request.location}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => sort === "urgent"
      ? ({ Emergency: 0, Urgent: 1, Normal: 2 }[a.urgency] - ({ Emergency: 0, Urgent: 1, Normal: 2 }[b.urgency]))
      : new Date(b.createdAt) - new Date(a.createdAt)), [providerRequests, view, urgency, search, sort]);

  const stats = {
    active: providerRequests.filter((request) => !["Completed", "Rejected"].includes(request.status)).length,
    completed: providerRequests.filter((request) => request.status === "Completed").length,
    rating: providerRequests.filter((request) => request.rating).length
      ? (providerRequests.filter((request) => request.rating).reduce((total, request) => total + request.rating, 0) /
        providerRequests.filter((request) => request.rating).length).toFixed(1)
      : "—",
  };

  const handleAccept = (requestId) => {
    const providerId = currentUser.providerId;
    acceptRequest(requestId, providerId);
  };

  const handleStatusUpdate = (requestId, currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      if (nextStatus === "Completed" && !window.confirm("Are you sure you want to mark this job as completed?")) {
        return;
      }
      updateRequestStatus(requestId, nextStatus);
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="surface p-4"><p className="text-xs text-gray-500">Active jobs</p><p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p></div>
        <div className="surface p-4"><p className="text-xs text-gray-500">Completed</p><p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p></div>
        <div className="surface p-4"><p className="text-xs text-gray-500">Customer rating</p><p className="text-2xl font-bold text-gray-900 mt-1">{stats.rating}</p></div>
      </div>
      <div className="surface p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <label className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input className="field px-4 py-3 pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests" aria-label="Search requests" />
          </label>
          <GlassSelect value={view} onChange={setView} ariaLabel="Request view" icon={SlidersHorizontal} options={[
            { value: "active", label: "Active jobs" }, { value: "history", label: "Job history" },
          ]} />
          <GlassSelect value={urgency} onChange={setUrgency} ariaLabel="Filter urgency" className="bare-select lg:w-40" options={[
            { value: "All", label: "All" }, { value: "Emergency", label: "Emergency" }, { value: "Urgent", label: "Urgent" }, { value: "Normal", label: "Normal" },
          ]} />
          <GlassSelect value={sort} onChange={setSort} ariaLabel="Sort requests" className="bare-select lg:w-40" options={[
            { value: "newest", label: "Newest first" }, { value: "urgent", label: "Urgency first" },
          ]} />
        </div>
      </div>

      {incomingRequests.length === 0 ? (
        <div className="surface p-12 text-center">
          <h2 className="font-semibold text-gray-900">No {view === "active" ? "active" : "historical"} requests</h2>
          <p className="text-gray-500 mt-2">New matching customer requests will appear here.</p>
          {view === "history" && (
            <button type="button" onClick={() => setView("active")} className="primary-button mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold">
              View active jobs
            </button>
          )}
          {view === "active" && (search || urgency !== "All") && (
            <button type="button" onClick={() => { setSearch(""); setUrgency("All"); }} className="primary-button mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {incomingRequests.map((req) => (
            <div key={req.id} className={`surface p-6 sm:p-7 ${req.urgency === "Emergency" ? "emergency-request" : ""}`}>
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
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reject this request?")) {
                          updateRequestStatus(req.id, "Rejected");
                        }
                      }}
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