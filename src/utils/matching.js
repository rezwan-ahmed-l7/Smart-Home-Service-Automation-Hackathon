const ACTIVE_STATUSES = ["Accepted", "On the Way", "In Progress"];

export function getUrgencyBonus(urgency) {
  return { Emergency: 5, Urgent: 3, Normal: 0 }[urgency] || 0;
}

function getExpertiseScore(provider, request) {
  const details = `${request.problemDetails || ""} ${request.serviceName || ""}`.toLowerCase();
  return provider.expertise.some((item) => details.includes(item.toLowerCase())) ? 1 : 0.7;
}

function getAvailabilityScore(provider, request) {
  return provider.availableSlots.includes(request.preferredTime) ? 1 : 0;
}

export function calculateMatchScore(provider, request) {
  if (!provider.services.includes(request.serviceId)) return 0;

  const expertise = getExpertiseScore(provider, request);
  const availability = getAvailabilityScore(provider, request);
  const distance = Math.max(0, 1 - provider.distance / 10);
  const rating = Math.max(0, Math.min(1, provider.rating / 5));
  const price = Math.max(0, Math.min(1, 1 - provider.basePrice / 6000));
  const urgency = getUrgencyBonus(request.urgency);

  return Math.round((
    expertise * 30 +
    availability * 25 +
    distance * 15 +
    rating * 15 +
    price * 10 +
    urgency
  ) * 10) / 10;
}

export function getMatchReasons(provider, request) {
  const reasons = [
    provider.services.includes(request.serviceId)
      ? `Supports ${request.serviceName}`
      : "Service compatible",
    getExpertiseScore(provider, request) === 1
      ? `Expert in ${provider.expertise.join(", ")}`
      : "Experienced local provider",
    getAvailabilityScore(provider, request)
      ? `Available at ${request.preferredTime}`
      : "Time slot needs confirmation",
    `${provider.distance} km away`,
    `${provider.rating}★ rating`,
    "Competitive price",
  ];
  return reasons;
}

export function getMatchedProviders(request, allProviders, existingRequests = []) {
  return allProviders
    .filter((provider) => provider.services.includes(request.serviceId))
    .filter((provider) => provider.availableSlots.includes(request.preferredTime))
    .filter((provider) => !existingRequests.some((existing) =>
      existing.assignedProviderId === provider.id &&
      ACTIVE_STATUSES.includes(existing.status) &&
      existing.preferredDate === request.preferredDate &&
      existing.preferredTime === request.preferredTime
    ))
    .map((provider) => ({
      ...provider,
      matchScore: calculateMatchScore(provider, request),
      urgencyBonus: getUrgencyBonus(request.urgency),
      matchReasons: getMatchReasons(provider, request),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
