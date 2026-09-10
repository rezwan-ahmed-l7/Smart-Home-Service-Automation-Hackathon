import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle, Circle, MapPin, Clock, User, Phone, Star } from "lucide-react";

const statusSteps = ["Requested", "Accepted", "On the Way", "In Progress", "Completed"];

export default function Tracking() {
  const { id } = useParams();
  const { requests, providers, currentUser, rateRequest, showToast } = useApp();
  const request = requests.find((r) => r.id === id && r.ownerEmail === currentUser?.email);
  const [selectedRating, setSelectedRating] = useState(request?.rating || 0);
  const [review, setReview] = useState(request?.review || "");
  const [ratingError, setRatingError] = useState("");

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
  const isRejected = request.status === "Rejected";

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
      {isRejected ? (
        <div className="rounded-2xl bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Provider declined this request.</p>
          <p className="text-sm mt-1">Find another provider for the same service and time slot.</p>
          <Link to="/" className="primary-button mt-4 px-4 py-2 rounded-xl text-sm font-semibold">
            Find Another Provider
          </Link>
        </div>
      ) : <div className="space-y-4">
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
        </div>}
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
          {request.image?.dataUrl && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Attached photo</p>
              <img src={request.image.dataUrl} alt="Attached service issue" className="max-h-44 w-auto rounded-xl border border-white/70 object-cover" />
            </div>
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
        <>
        <div className="surface p-6 sm:p-7 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Digital invoice</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <span>Service</span><strong className="text-right text-gray-900">{request.serviceName}</strong>
            <span>Provider</span><strong className="text-right text-gray-900">{assignedProvider?.name || "Assigned provider"}</strong>
            <span>Date</span><strong className="text-right text-gray-900">{request.preferredDate}</strong>
            <span>Estimated price</span><strong className="text-right text-gray-900">{assignedProvider?.priceRange || "To be confirmed"}</strong>
            <span>Rating</span><strong className="text-right text-gray-900">{request.rating ? `${request.rating}/5` : "Not rated yet"}</strong>
          </div>
        </div>
        <div className="surface p-6 sm:p-7 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            {request.rating ? "Your service rating" : "Rate this service"}
          </h2>
          <div className="flex gap-1" aria-label="Service rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                disabled={Boolean(request.rating)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className={`rating-star ${star <= selectedRating ? "selected" : ""}`}
                onClick={() => setSelectedRating(star)}
              >
                <Star size={22} fill={star <= selectedRating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          {!request.rating ? (
            <>
              <textarea
                className="field px-4 py-3 mt-4 resize-none"
                rows={3}
                maxLength={500}
                value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder="Tell us how the service went (optional)"
              />
              {ratingError && <p className="text-sm text-red-600 mt-2" role="alert">{ratingError}</p>}
              <button
                type="button"
                className="primary-button mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold"
                onClick={() => {
                  if (!selectedRating) {
                    setRatingError("Please select between 1 and 5 stars.");
                    return;
                  }
                  if (rateRequest(id, selectedRating, review)) {
                    showToast("Thanks — your rating was submitted.");
                  }
                }}
              >
                Submit rating
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-2">{request.review || "Thanks for sharing your feedback."}</p>
          )}
        </div>
        </>
      )}

      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Back to Home
      </Link>
    </div>
  );
}