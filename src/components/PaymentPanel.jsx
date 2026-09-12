import { useMemo, useState } from "react";
import { CreditCard, Smartphone, WalletCards } from "lucide-react";
import { useApp } from "../context/AppContext";

const METHODS = [
  { value: "bKash", label: "bKash", icon: Smartphone },
  { value: "Nagad", label: "Nagad", icon: WalletCards },
  { value: "Card", label: "Card", icon: CreditCard },
  { value: "Cash on Service", label: "Cash on Service", icon: WalletCards },
];
const MULTIPLIERS = { Normal: 1, Urgent: 1.15, Emergency: 1.3 };

function calculatePaymentAmount(basePrice, urgency) {
  const base = Number(basePrice) || 0;
  return {
    base,
    surcharge: Math.round(base * ((MULTIPLIERS[urgency] || 1) - 1)),
    total: Math.round(base * (MULTIPLIERS[urgency] || 1)),
  };
}

export default function PaymentPanel({ request, provider }) {
  const { markRequestPaid } = useApp();
  const [method, setMethod] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = useMemo(
    () => calculatePaymentAmount(provider?.basePrice, request.urgency),
    [provider?.basePrice, request.urgency]
  );
  const isPaid = request.paymentStatus === "Paid";
  const isPayOnService = request.paymentStatus === "Pay on Service";
  const canPay = ["Accepted", "On the Way", "In Progress", "Completed"].includes(request.status);

  if (!canPay || !provider) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isPaid || isPayOnService) {
      setError(isPaid ? "This request has already been paid." : "Pay on Service is already confirmed for this request.");
      return;
    }
    if (!method) {
      setError("Please choose a payment method.");
      return;
    }
    if (method === "bKash" || method === "Nagad") {
      if (!/^\d{11}$/.test(detail)) {
        setError("Enter an 11-digit phone number.");
        return;
      }
    }
    if (method === "Card" && !/^\d{4}$/.test(detail)) {
      setError("Enter the last 4 digits of your card.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    if (!markRequestPaid(request.id, { method, amount: amount.total })) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surface p-6 sm:p-7 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <p className="eyebrow">Secure demo checkout</p>
          <h2 className="font-semibold text-gray-900 mt-1">Payment</h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
          isPaid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
        }`}>
          {isPaid ? "Paid" : "Payment pending"}
        </span>
      </div>

      {isPaid ? (
        <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-800">
          Paid via <strong>{request.paymentMethod}</strong> • ৳{request.paidAmount.toLocaleString()}
        </div>
      ) : isPayOnService ? (
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
          <strong>Pay on Service</strong>
          <p className="mt-1">You&apos;ll pay ৳{amount.total.toLocaleString()} to the provider after the service is completed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {METHODS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  method === value
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                    : "border-white/70 bg-white/30 text-gray-600 hover:border-indigo-200"
                }`}
                onClick={() => { setMethod(value); setDetail(""); setError(""); }}
              >
                <Icon size={17} className="mx-auto mb-1" />
                {label}
              </button>
            ))}
          </div>
          {(method === "bKash" || method === "Nagad") && (
            <input className="field px-4 py-3 mb-4" value={detail} onChange={(event) => setDetail(event.target.value.replace(/\D/g, "").slice(0, 11))} placeholder={`${method} phone number`} inputMode="numeric" aria-label={`${method} phone number`} />
          )}
          {method === "Card" && (
            <input className="field px-4 py-3 mb-4" value={detail} onChange={(event) => setDetail(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Last 4 digits" inputMode="numeric" aria-label="Last 4 digits" />
          )}
          {method === "Cash on Service" && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800 mb-4">
              You&apos;ll pay ৳{amount.total.toLocaleString()} to the provider after the service is completed.
            </div>
          )}
          <div className="rounded-xl bg-white/35 p-4 text-sm text-gray-600 space-y-2 mb-4">
            <div className="flex justify-between"><span>Base service</span><strong className="text-gray-900">৳{amount.base.toLocaleString()}</strong></div>
            <div className="flex justify-between"><span>{request.urgency} surcharge</span><strong className="text-gray-900">৳{amount.surcharge.toLocaleString()}</strong></div>
            <div className="flex justify-between border-t border-white/70 pt-2 text-base"><span className="font-semibold text-gray-900">Total</span><strong className="text-indigo-700">৳{amount.total.toLocaleString()}</strong></div>
          </div>
          {error && <p className="text-sm text-red-600 mb-3" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="primary-button w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold">
            {method === "Cash on Service"
              ? `Confirm Pay on Service · ৳${amount.total.toLocaleString()}`
              : `Pay Now · Confirm ৳${amount.total.toLocaleString()}`}
          </button>
        </form>
      )}
    </div>
  );
}
