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

  return Math.round(score * 10) / 10;
}

export function getMatchedProviders(request, allProviders) {
  return allProviders
    .map((provider) => ({
      ...provider,
      matchScore: calculateMatchScore(provider, request),
    }))
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}