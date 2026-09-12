import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, AtSign, LockKeyhole, Phone, UserRound, Wrench } from "lucide-react";
import { useApp } from "../context/AppContext";
import GlassSelect from "../components/GlassSelect";

const initialForm = { username: "", phone: "", email: "", password: "" };

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authenticate, providers } = useApp();
  const [role, setRole] = useState(searchParams.get("role") === "provider" ? "provider" : "customer");
  const [form, setForm] = useState({ ...initialForm, providerId: "" });
  const [loginError, setLoginError] = useState("");
  const registrationComplete = searchParams.get("registered") === "1";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (role === "provider" && !form.providerId) {
      setLoginError("Choose your provider profile to continue.");
      return;
    }
    const result = authenticate({
      username: form.username,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role,
      providerId: role === "provider" ? form.providerId : null,
    });
    if (!result.success) {
      setLoginError(result.error);
      return;
    }
    setLoginError("");
    navigate(result.user.role === "provider" ? "/provider" : "/");
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setForm((previous) => ({ ...previous, providerId: "" }));
    setLoginError("");
  };

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-showcase-copy">
          <p className="eyebrow">Smart Home Service</p>
          <h1>Welcome to smarter home service.</h1>
          <p>Connect with the right professional, at the right time.</p>
          <div className="login-benefits"><span>✓ Smart provider matching</span><span>✓ Flexible scheduling</span><span>✓ Service tracking</span></div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card surface">
          <div className="mb-7">
            <p className="eyebrow">Welcome back</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">Sign in to your account</h2>
            <p className="text-gray-500 mt-2 text-sm">Choose your role to continue.</p>
          </div>

          <div className="role-switch" aria-label="Account type">
            <button type="button" className={role === "customer" ? "selected" : ""} onClick={() => handleRoleChange("customer")}>
              <UserRound size={16} /> Customer
            </button>
            <button type="button" className={role === "provider" ? "selected" : ""} onClick={() => handleRoleChange("provider")}>
              <Wrench size={16} /> Provider
            </button>
          </div>
          {registrationComplete && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 mt-4" role="status">Account created. Sign in to continue.</p>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <label className="login-field">
              <span>Username</span>
              <div><UserRound size={17} /><input className="field" name="username" value={form.username} onChange={handleChange} placeholder="Your username" minLength={2} pattern="[A-Za-z0-9_ ]+" title="Use letters, numbers, spaces, or underscores" required /></div>
            </label>
            {role === "provider" && (
              <label className="login-field">
                <span>Provider profile</span>
                <GlassSelect
                  value={form.providerId}
                  onChange={(providerId) => setForm((previous) => ({ ...previous, providerId }))}
                  options={providers.map((provider) => ({ value: provider.id, label: provider.name }))}
                  ariaLabel="Provider profile"
                  icon={Wrench}
                  className="login-select"
                />
              </label>
            )}
            <label className="login-field">
              <span>Phone number</span>
              <div><Phone size={17} /><input className="field" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" pattern="[0-9]{11}" title="Enter exactly 11 digits" required /></div>
            </label>
            <label className="login-field">
              <span>Gmail address</span>
              <div><AtSign size={17} /><input className="field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@gmail.com" pattern=".+@gmail\.com" title="Please use a Gmail address" required /></div>
            </label>
            <label className="login-field">
              <span>Password</span>
              <div><LockKeyhole size={17} /><input className="field" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" minLength={6} required /></div>
            </label>
            <button className="primary-button w-full rounded-xl py-3.5 font-bold mt-2" type="submit">
              Sign In <ArrowRight size={17} />
            </button>
            {loginError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{loginError}</p>}
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">New here? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Create an account</Link></p>
          <button type="button" onClick={() => navigate(-1)} className="text-indigo-600 text-sm font-semibold mt-5 hover:underline w-full">← Back</button>
        </div>
      </section>
    </main>
  );
}
