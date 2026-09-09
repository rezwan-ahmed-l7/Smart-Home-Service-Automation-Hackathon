export function getUrgencyBonus(urgency) {
  return { Emergency: 15, Urgent: 8, Normal: 0 }[urgency] || 0;
}

export function calculateMatchScore(provider, request) {
  let score = 0;

  // 1. Service Match (must have)
  if (!provider.services.includes(request.serviceId)) {
    return 0;
  }
  score += 30;

  // 2. Rating (0-20 points)
  score += (provider.rating / 5) * 20;

  // 3. Distance (closer = higher, max 20 points)
  const distanceScore = Math.max(0, 20 - provider.distance * 2);
  score += distanceScore;

  // 4. Price (lower basePrice = higher, max 15 points)
  const priceScore = Math.max(0, 15 - provider.basePrice / 300);
  score += priceScore;

  // 5. Availability (if has preferred time slot)
  if (request.preferredTime && provider.availableSlots.includes(request.preferredTime)) {
    score += 15;
  } else {
    score += 5; // still some points if other slots available
  }

  score += getUrgencyBonus(request.urgency);
  return Math.round(score * 10) / 10;
}

export function getMatchedProviders(request, allProviders, existingRequests = []) {
  return allProviders
    .filter((provider) => !existingRequests.some((existing) =>
      existing.assignedProviderId === provider.id &&
      ["Accepted", "On the Way", "In Progress"].includes(existing.status) &&
      existing.preferredDate === request.preferredDate &&
      existing.preferredTime === request.preferredTime
    ))
    .map((provider) => ({
      ...provider,
      matchScore: calculateMatchScore(provider, request),
      urgencyBonus: getUrgencyBonus(request.urgency),
    }))
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}