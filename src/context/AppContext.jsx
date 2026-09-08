import { createContext, useContext, useState, useEffect } from "react";
import { providers } from "../data/providers";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("service_requests");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState("customer"); // "customer" | "provider"

  useEffect(() => {
    localStorage.setItem("service_requests", JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
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

  return (
    <AppContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        acceptRequest,
        currentUser,
        setCurrentUser,
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