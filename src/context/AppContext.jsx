import { createContext, useContext, useState, useEffect } from "react";
import { providers } from "../data/providers";

const AppContext = createContext();
const ACTIVE_STATUSES = ["Accepted", "On the Way", "In Progress"];
const PAYABLE_STATUSES = ["Accepted", "On the Way", "In Progress", "Completed"];
const STATUS_TRANSITIONS = {
  Requested: ["Accepted", "Rejected"],
  Accepted: ["On the Way"],
  "On the Way": ["In Progress"],
  "In Progress": ["Completed"],
  Completed: [],
  Rejected: [],
};
const normalizeRequest = (request) => ({
  ...request,
  paymentStatus: ["Paid", "Pay on Service"].includes(request.paymentStatus)
    ? request.paymentStatus
    : "Unpaid",
  paymentMethod: request.paymentMethod || null,
  paidAmount: Number.isFinite(request.paidAmount) ? request.paidAmount : null,
  paidAt: request.paidAt || null,
});
const normalizeAccount = (account) => ({
  ...account,
  username: typeof account.username === "string" ? account.username : "",
  phone: typeof account.phone === "string" ? account.phone : "",
  email: typeof account.email === "string" ? account.email.toLowerCase() : "",
  password: typeof account.password === "string" ? account.password : "",
  role: account.role === "provider" ? "provider" : "customer",
  providerId: account.role === "provider" ? account.providerId || null : null,
});

function readStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : fallback;
    if (["service_requests", "smartservice_booked_slots", "smartservice_accounts"].includes(key) && !Array.isArray(parsed)) return fallback;
    if (key === "smartservice_user" && (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))) {
      return fallback;
    }
    return parsed;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function persistValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function AppProvider({ children }) {
  const [requests, setRequests] = useState(() =>
    readStoredValue("service_requests", []).map(normalizeRequest)
  );

  const [currentUser, setCurrentUser] = useState(() =>
    readStoredValue("smartservice_user", null)
  );
  const [accounts, setAccounts] = useState(() =>
    readStoredValue("smartservice_accounts", [])
      .filter((account) => account && typeof account === "object")
      .map(normalizeAccount)
  );
  const [bookedSlots, setBookedSlots] = useState(() =>
    readStoredValue("smartservice_booked_slots", [])
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    persistValue("service_requests", requests);
  }, [requests]);

  useEffect(() => {
    persistValue("smartservice_booked_slots", bookedSlots);
  }, [bookedSlots]);

  useEffect(() => {
    persistValue("smartservice_accounts", accounts);
  }, [accounts]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2500);
  };

  const login = (user) => {
    setCurrentUser(user);
    persistValue("smartservice_user", user);
  };

  const registerAccount = (account) => {
    const normalized = normalizeAccount({
      ...account,
      email: account.email.trim().toLowerCase(),
      username: account.username.trim(),
    });
    const duplicate = accounts.some((item) =>
      item.email === normalized.email || item.username.toLowerCase() === normalized.username.toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: "An account with that username or Gmail already exists." };
    }
    if (normalized.role === "provider" && !providers.some((provider) => provider.id === normalized.providerId)) {
      return { success: false, error: "Choose a provider profile to continue." };
    }
    setAccounts((previous) => [...previous, normalized]);
    const { password: _password, ...sessionUser } = normalized;
    login(sessionUser);
    return { success: true, user: sessionUser };
  };

  const authenticate = ({ username, email, phone, password, role, providerId }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const account = accounts.find((item) =>
      item.username.toLowerCase() === normalizedUsername &&
      item.email === normalizedEmail &&
      item.phone === phone &&
      item.password === password &&
      item.role === role &&
      (role !== "provider" || item.providerId === providerId)
    );
    if (!account) {
      return { success: false, error: "The details you entered do not match a registered account." };
    }
    const { password: _password, ...sessionUser } = account;
    login(sessionUser);
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("smartservice_user");
  };

  const addRequest = (request) => {
    if (currentUser?.role !== "customer") {
      showToast("Only customers can create service requests.", "error");
      return null;
    }
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      ownerEmail: currentUser?.email,
      ownerUsername: currentUser?.username,
      status: "Requested",
      paymentStatus: "Unpaid",
      paymentMethod: null,
      paidAmount: null,
      paidAt: null,
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const markRequestPaid = (id, { method, amount }) => {
    const request = requests.find((item) => item.id === id);
    const ownsRequest = request?.ownerEmail === currentUser?.email;
    const validMethod = ["bKash", "Nagad", "Card", "Cash on Service"].includes(method);
    if (!request || !ownsRequest || !PAYABLE_STATUSES.includes(request.status) ||
      ["Paid", "Pay on Service"].includes(request.paymentStatus) ||
      !validMethod || !Number.isFinite(amount) || amount <= 0) {
      showToast("This request cannot be paid.", "error");
      return false;
    }
    const isCashOnService = method === "Cash on Service";
    setRequests((prev) => prev.map((req) => req.id === id ? {
      ...req,
      paymentStatus: isCashOnService ? "Pay on Service" : "Paid",
      paymentMethod: method,
      paidAmount: isCashOnService ? null : amount,
      paidAt: isCashOnService ? null : new Date().toISOString(),
    } : req));
    showToast(isCashOnService ? "Pay on Service confirmed." : "Payment confirmed successfully.");
    return true;
  };

  const updateRequestStatus = (id, status) => {
    const request = requests.find((item) => item.id === id);
    if (!request || !STATUS_TRANSITIONS[request.status]?.includes(status)) {
      showToast("That status update is not allowed.", "error");
      return false;
    }
    const isAssignedProvider = currentUser?.role === "provider" &&
      request.assignedProviderId === currentUser.providerId;
    const isEligibleProvider = currentUser?.role === "provider" &&
      request.status === "Requested" &&
      request.matchedProviders?.some((provider) => provider.id === currentUser.providerId);
    if (!isAssignedProvider && !isEligibleProvider) {
      showToast("You are not authorized to update this request.", "error");
      return false;
    }
    setRequests((prev) => prev.map((req) => (
      req.id === id ? {
        ...req,
        status,
        ...(status === "Rejected" ? { assignedProviderId: null } : {}),
      } : req
    )));
    if (status === "Rejected") {
      setBookedSlots((prev) => prev.filter((slot) => slot.requestId !== id));
    }
    showToast(`Request marked ${status.toLowerCase()}.`);
    return true;
  };

  const acceptRequest = (id, providerId) => {
    const request = requests.find((item) => item.id === id);
    const provider = providers.find((item) => item.id === providerId);
    const isOwner = currentUser?.role === "customer" &&
      request?.ownerEmail === currentUser.email;
    const isAuthorized = request?.status === "Requested" &&
      request.matchedProviders?.some((item) => item.id === providerId) &&
      (isOwner || (currentUser?.role === "provider" && currentUser.providerId === providerId));
    const slotIsBooked = requests.some((item) =>
      item.id !== id &&
      item.assignedProviderId === providerId &&
      ACTIVE_STATUSES.includes(item.status) &&
      item.preferredDate === request?.preferredDate &&
      item.preferredTime === request?.preferredTime
    );
    if (!request || !provider || !isAuthorized || !provider.services.includes(request.serviceId)) {
      showToast("You are not authorized to assign this provider.", "error");
      return false;
    }
    if (!provider.availableSlots.includes(request.preferredTime) || slotIsBooked) {
      showToast("That provider is no longer available for this time.", "error");
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
    const request = requests.find((item) => item.id === id);
    const cleanReview = typeof review === "string" ? review.trim() : "";
    const ownsRequest = request?.ownerEmail === currentUser?.email;
    if (!ownsRequest || request.status !== "Completed" || request.rating ||
      !Number.isInteger(rating) || rating < 1 || rating > 5 || cleanReview.length > 500) {
      showToast("This request cannot be rated.", "error");
      return false;
    }
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, rating, review: cleanReview, ratedAt: new Date().toISOString() }
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
        markRequestPaid,
        currentUser,
        login,
        authenticate,
        registerAccount,
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