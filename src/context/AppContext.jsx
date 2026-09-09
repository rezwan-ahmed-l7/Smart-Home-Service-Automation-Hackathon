import { createContext, useContext, useState, useEffect } from "react";
import { providers } from "../data/providers";

const AppContext = createContext();

function readStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : fallback;
    if (key === "service_requests" && !Array.isArray(parsed)) return fallback;
    if (key === "smartservice_user" && (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))) {
      return fallback;
    }
    return parsed;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [requests, setRequests] = useState(() =>
    readStoredValue("service_requests", [])
  );

  const [currentUser, setCurrentUser] = useState(() =>
    readStoredValue("smartservice_user", null)
  );

  useEffect(() => {
    localStorage.setItem("service_requests", JSON.stringify(requests));
  }, [requests]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("smartservice_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("smartservice_user");
  };

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      ownerEmail: currentUser?.email,
      status: "Requested",
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const acceptRequest = (id, providerId) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "Accepted", assignedProviderId: providerId }
          : req
      )
    );
  };

  const rateRequest = (id, rating, review) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return false;
    }
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id && req.ownerEmail === currentUser?.email && req.status === "Completed" && !req.rating
          ? { ...req, rating, review: review.trim(), ratedAt: new Date().toISOString() }
          : req
      )
    );
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        acceptRequest,
        rateRequest,
        currentUser,
        login,
        logout,
        providers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}