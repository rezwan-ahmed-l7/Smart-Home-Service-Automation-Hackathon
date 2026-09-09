import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench, Droplets, Zap, Sparkles, Home, Truck, Car, User,
  MapPin, Calendar, Clock, AlertCircle, FileText, Phone, Image as ImageIcon, Search
} from "lucide-react";
import { serviceCategories } from "../data/services";
import { useApp } from "../context/AppContext";
import { getMatchedProviders } from "../utils/matching";

const iconMap = {
  Wrench, Droplets, Zap, Sparkles, Home, Truck, Car, User
};

export default function CustomerHome() {
  const navigate = useNavigate();
  const { addRequest, providers } = useApp();

  const [step, setStep] = useState(1); // 1 = select service, 2 = form
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    location: "",
    preferredDate: "",
    preferredTime: "",
    urgency: "Normal",
    problemDetails: "",
    contactName: "",
    contactPhone: "",
    image: null,
  });

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phone = form.contactPhone.trim();
    if (!/^\d{11}$/.test(phone)) {
      setFormError("Phone number must contain exactly 11 digits.");
      return;
    }
    if (!/^[a-zA-Z][a-zA-Z .'-]{1,59}$/.test(form.contactName.trim())) {
      setFormError("Name must contain letters and spaces only.");
      return;
    }
    if (new Date(`${form.preferredDate}T23:59:59`) < new Date()) {
      setFormError("Preferred date must be today or a future date.");
      return;
    }
    setFormError("");

    const requestData = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      ...form,
      location: form.location.trim(),
      contactName: form.contactName.trim(),
      contactPhone: phone,
      image: form.image
        ? {
            name: form.image.name,
            type: form.image.type,
            size: form.image.size,
          }
        : null,
    };

    // Get matched providers
    const matched = getMatchedProviders(requestData, providers);

    // Save request
    const newRequest = addRequest({
      ...requestData,
      matchedProviders: matched.slice(0, 5), // top 5
      status: "Requested",
    });

    // Go to matching result page
    navigate(`/match/${newRequest.id}`);
  };

  // ========== STEP 1: Service Selection ==========
  if (step === 1) {
    return (
      <div className="page-wrap">
        <div className="max-w-3xl mb-10">
          <p className="eyebrow">Reliable help, beautifully simple</p>
          <h1 className="page-title">Make home feel effortless.</h1>
          <p className="page-subtitle mt-3">Tell us what you need and we’ll connect you with a trusted local professional.</p>
          <label className="relative block mt-6 max-w-xl">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              className="field px-4 py-3 pl-11"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services, e.g. plumbing or cleaning"
              aria-label="Search services"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCategories.filter((service) =>
            `${service.name} ${service.description}`.toLowerCase().includes(search.trim().toLowerCase())
          ).map((service) => {
            const Icon = iconMap[service.icon] || Wrench;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="surface service-card p-5 text-left group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition">
                  <Icon className="text-indigo-600" size={23} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm leading-5 text-gray-500">{service.description}</p>
              </button>
            );
          })}
        </div>
        {serviceCategories.filter((service) =>
          `${service.name} ${service.description}`.toLowerCase().includes(search.trim().toLowerCase())
        ).length === 0 && <p className="text-gray-500 mt-6">No services match your search.</p>}
      </div>
    );
  }

  // ========== STEP 2: Request Form ==========
  return (
    <div className="page-wrap max-w-3xl">
      <button
        onClick={() => setStep(1)}
        className="text-indigo-600 text-sm font-semibold mb-8 hover:underline"
      >
        ← Back to services
      </button>

      <div className="mb-8">
        <p className="eyebrow">Service request</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">Request {selectedService.name}</h1>
        <p className="text-gray-600 mt-2">A few details help us find the right professional for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="surface p-6 sm:p-8 space-y-6">
        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <MapPin size={16} /> Location *
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="field px-4 py-3"
            required
            minLength={2}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Calendar size={16} /> Preferred Date *
            </label>
            <div className="control-wrap calendar-control">
              <input
                type="date"
                name="preferredDate"
                value={form.preferredDate}
                onChange={handleChange}
                className="field px-4 py-3"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Clock size={16} /> Preferred Time *
            </label>
            <div className="select-field bare-select">
              <select
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                className="field px-4 py-3"
                required
              >
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="4:30 PM">4:30 PM</option>
                <option value="5:00 PM">5:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <AlertCircle size={16} /> Urgency
          </label>
          <div className="flex gap-3">
            {["Normal", "Urgent", "Emergency"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, urgency: level }))}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                  form.urgency === level
                    ? level === "Emergency"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : level === "Urgent"
                      ? "bg-orange-50 border-orange-500 text-orange-700"
                      : "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-gray-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Details */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <FileText size={16} /> Problem Details
          </label>
          <textarea
            name="problemDetails"
            value={form.problemDetails}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the issue briefly..."
            className="field px-4 py-3 resize-none"
          />
        </div>

        {/* Contact */}
        {formError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <User size={16} /> Your Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Full name"
              className="field px-4 py-3"
              required
              pattern="[A-Za-z][A-Za-z .'-]{1,59}"
              title="Use letters and spaces only"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Phone size={16} /> Phone Number *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="field px-4 py-3"
              required
              pattern="[0-9]{11}"
              title="Enter exactly 11 digits"
            />
          </div>
        </div>

        {/* Optional Image */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
            <ImageIcon size={16} /> Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files[0] }))}
            className="file-field"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="primary-button w-full font-bold py-3.5 rounded-xl"
        >
          Find Best Providers
        </button>
      </form>
    </div>
  );
}