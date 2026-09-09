import { createContext, useContext, useState, useEffect } from "react";
import { providers } from "../data/providers";

const AppContext = createContext();

function readStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : fallback;
    if (["service_requests", "smartservice_booked_slots"].includes(key) && !Array.isArray(parsed)) return fallback;
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
  const [bookedSlots, setBookedSlots] = useState(() =>
    readStoredValue("smartservice_booked_slots", [])
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("service_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("smartservice_booked_slots", JSON.stringify(bookedSlots));
  }, [bookedSlots]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2500);
  };

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
      ownerUsername: currentUser?.username,
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
    if (status === "Rejected") {
      setBookedSlots((prev) => prev.filter((slot) => slot.requestId !== id));
    }
    showToast(`Request marked ${status.toLowerCase()}.`);
  };

  const acceptRequest = (id, providerId) => {
    const request = requests.find((item) => item.id === id);
    const slotIsBooked = requests.some((item) =>
      item.id !== id &&
      item.assignedProviderId === providerId &&
      ["Accepted", "On the Way", "In Progress"].includes(item.status) &&
      item.preferredDate === request?.preferredDate &&
      item.preferredTime === request?.preferredTime
    );
    if (!request || slotIsBooked) {
      showToast("That provider is already booked for this time.", "error");
      return false;
    }
    setRequests((prev) => prev.map((req) =>
      req.id === id ? { ...req, status: "Accepted", assignedProviderId: providerId } : req
    ));
    setBookedSlots((prev) => [
      ...prev.filter((slot) => slot.requestId !== id),
      { requestId: id, providerId, date: request.preferredDate, time: request.preferredTime },
    ]);
    showToast("Provider accepted successfully.");
    return true;
  };

  const rateRequest = (id, rating, review) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return false;
    }
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id &&
          (req.ownerEmail === currentUser?.email || req.ownerUsername === currentUser?.username) &&
          req.status === "Completed" && !req.rating
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
        bookedSlots,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}