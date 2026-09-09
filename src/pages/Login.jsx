import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AtSign, LockKeyhole, Phone, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { useApp } from "../context/AppContext";
import GlassSelect from "../components/GlassSelect";

const initialForm = { username: "", phone: "", email: "", password: "" };

export default function Login() {
  const navigate = useNavigate();
  const { login, providers } = useApp();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({ ...initialForm, providerId: providers[0]?.id || "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login({
      username: form.username.trim(),
      phone: form.phone,
      email: form.email.trim().toLowerCase(),
      role,
      providerId: role === "provider" ? form.providerId : null,
    });
    navigate(role === "provider" ? "/provider" : "/");
  };

  return (
    <main className="login-page">
      <section className="login-showcase">
        <Link to="/" className="brand-mark login-brand">
          <span className="brand-icon"><Wrench size={19} /></span>
          Smart<span className="text-indigo-600">Service</span>
        </Link>
        <div className="login-showcase-copy">
          <p className="eyebrow">One account. Every solution.</p>
          <h1>Home care that moves at your pace.</h1>
          <p>Sign in to keep your requests, trusted providers, and service updates all in one place.</p>
          <div className="login-trust"><ShieldCheck size={18} /> Your details stay private and secure.</div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card surface">
          <div className="mb-7">
            <p className="eyebrow">Welcome back</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">Sign in to continue</h2>
            <p className="text-gray-500 mt-2 text-sm">Choose your workspace and enter your details below.</p>
          </div>

          <div className="role-switch" aria-label="Account type">
            <button type="button" className={role === "customer" ? "selected" : ""} onClick={() => setRole("customer")}>
              <UserRound size={16} /> Customer
            </button>
            <button type="button" className={role === "provider" ? "selected" : ""} onClick={() => setRole("provider")}>
              <Wrench size={16} /> Provider
            </button>
          </div>

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
              Sign in as {role} <ArrowRight size={17} />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">By continuing, you agree to our Terms and Privacy Policy.</p>
        </div>
      </section>
    </main>
  );
}
