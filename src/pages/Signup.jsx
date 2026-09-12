import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AtSign, LockKeyhole, Phone, UserRound, Wrench } from "lucide-react";
import { useApp } from "../context/AppContext";
import GlassSelect from "../components/GlassSelect";

const initialForm = {
  username: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  providerId: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const { providers, registerAccount } = useApp();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState(initialForm);
  const [signupError, setSignupError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setSignupError("");
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setForm((previous) => ({ ...previous, providerId: "" }));
    setSignupError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (role === "provider" && !form.providerId) {
      setSignupError("Choose a provider profile to continue.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    const result = registerAccount({
      username: form.username,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role,
      providerId: role === "provider" ? form.providerId : null,
    });
    if (!result.success) {
      setSignupError(result.error);
      return;
    }
    navigate("/login?registered=1");
  };

  return (
    <main className="login-page signup-page">
      <section className="login-showcase">
        <Link to="/" className="brand-mark login-brand">
          <span className="brand-icon"><Wrench size={19} /></span>
          Smart Home <span className="text-indigo-600">Service</span>
        </Link>
        <div className="login-showcase-copy">
          <p className="eyebrow">A better way to get things done</p>
          <h1>Make home feel effortless.</h1>
          <p>Create your account and connect with the right service experience for you.</p>
          <div className="login-benefits">
            <span>✓ One place for every request</span>
            <span>✓ Providers matched to your needs</span>
            <span>✓ Clear updates from booking to completion</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card surface">
          <div className="mb-6">
            <p className="eyebrow">Get started</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">Create your account</h2>
            <p className="text-gray-500 mt-2 text-sm">Choose how you&apos;ll use Smart Home Service.</p>
          </div>

          <div className="role-switch" aria-label="Account type">
            <button type="button" className={role === "customer" ? "selected" : ""} onClick={() => handleRoleChange("customer")}>
              <UserRound size={16} /> Customer
            </button>
            <button type="button" className={role === "provider" ? "selected" : ""} onClick={() => handleRoleChange("provider")}>
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
                  options={[{ value: "", label: "Select your service profile" }, ...providers.map((provider) => ({ value: provider.id, label: provider.name }))]}
                  ariaLabel="Provider profile"
                  icon={Wrench}
                  className="login-select"
                />
              </label>
            )}
            <label className="login-field">
              <span>Phone number</span>
              <div><Phone size={17} /><input className="field" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" pattern="01[0-9]{9}" title="Enter a valid 11-digit Bangladesh phone number" required /></div>
            </label>
            <label className="login-field">
              <span>Gmail address</span>
              <div><AtSign size={17} /><input className="field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@gmail.com" pattern=".+@gmail\.com" title="Please use a Gmail address" required /></div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="login-field">
                <span>Password</span>
                <div><LockKeyhole size={17} /><input className="field" type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" minLength={6} required /></div>
              </label>
              <label className="login-field">
                <span>Confirm password</span>
                <div><LockKeyhole size={17} /><input className="field" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" minLength={6} required /></div>
              </label>
            </div>
            <button className="primary-button w-full rounded-xl py-3.5 font-bold mt-2" type="submit">
              Create account <ArrowRight size={17} />
            </button>
            {signupError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{signupError}</p>}
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">Already registered? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link></p>
          <p className="text-center text-xs text-gray-400 mt-4"><Link to="/" className="text-indigo-600 hover:underline">← Back to Home</Link></p>
        </div>
      </section>
    </main>
  );
}
