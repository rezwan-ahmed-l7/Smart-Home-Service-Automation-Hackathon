import { Link } from "react-router-dom";
import {
  ArrowRight, CalendarCheck, CheckCircle2, ChevronRight, Clock3, Compass,
  Droplets, Home, MapPin, ShieldCheck, Sparkles, Star, Truck, UserRound,
  Wrench, Zap
} from "lucide-react";
import { serviceCategories } from "../data/services";

const iconMap = { Wrench, Droplets, Zap, Sparkles, Home, Truck, User: UserRound };
const matchingSignals = [
  { label: "Availability", icon: CalendarCheck },
  { label: "Distance", icon: MapPin },
  { label: "Rating", icon: Star },
  { label: "Price", icon: Compass },
  { label: "Expertise", icon: Wrench },
];
const trackingSteps = ["Requested", "Accepted", "On the Way", "In Progress", "Completed"];

export default function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-hero page-wrap">
        <div className="landing-hero-copy">
          <p className="eyebrow">Smart help for every corner of home</p>
          <h1 className="landing-title">Home problems.<br /><span>Smarter solutions.</span></h1>
          <p className="landing-lede">
            Find the right service provider, compare smart matches, schedule a convenient time,
            and track your service — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/login" className="primary-button px-6 py-3 rounded-xl font-bold">
              Get Started <ArrowRight size={17} />
            </Link>
            <Link to="/login?role=provider" className="landing-secondary-button px-6 py-3 rounded-xl font-bold">
              I&apos;m a Service Provider
            </Link>
          </div>
          <p className="landing-signin">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        <div className="landing-hero-art surface" aria-label="Smart service dashboard preview">
          <div className="landing-art-glow" />
          <div className="flex items-center justify-between relative">
            <span className="eyebrow">Your service, in sight</span>
            <span className="landing-live-pill"><span /> Live tracking</span>
          </div>
          <div className="landing-art-card">
            <div className="flex items-start justify-between">
              <div><p className="text-xs text-gray-500">Today&apos;s request</p><h2 className="text-lg font-bold text-gray-900 mt-1">AC maintenance</h2></div>
              <CheckCircle2 className="text-emerald-500" size={22} />
            </div>
            <div className="landing-progress"><span /></div>
            <div className="flex justify-between text-xs text-gray-500"><span>Provider on the way</span><strong className="text-indigo-600">12 min away</strong></div>
          </div>
          <div className="landing-art-match">
            <div className="landing-avatar"><ShieldCheck size={18} /></div>
            <div><p className="text-xs text-gray-500">Smart match found</p><p className="font-bold text-gray-900">Top-rated nearby pro</p></div>
            <Star size={16} className="ml-auto text-amber-400" fill="currentColor" />
          </div>
        </div>
      </section>

      <section className="landing-section page-wrap">
        <div className="text-center max-w-2xl mx-auto mb-10"><p className="eyebrow">Simple from start to finish</p><h2 className="landing-section-title">Help is only five steps away.</h2></div>
        <div className="landing-steps">
          {["Tell us your problem", "Smart provider matching", "Choose your provider", "Schedule your service", "Track your service"].map((step, index) => (
            <div className="landing-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p>{index < 4 && <ChevronRight className="landing-step-arrow" size={18} />}</div>
          ))}
        </div>
      </section>

      <section className="landing-section page-wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><p className="eyebrow">Whatever you need</p><h2 className="landing-section-title">Services that fit real life.</h2></div><p className="landing-section-note">One trusted place for the jobs that keep your home moving.</p></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {serviceCategories.map((service) => { const Icon = iconMap[service.icon] || Wrench; return <div className="surface landing-category" key={service.id}><Icon size={22} className="text-indigo-600" /><h3>{service.name}</h3><p>{service.description}</p></div>; })}
        </div>
      </section>

      <section className="landing-feature page-wrap">
        <div className="landing-feature-copy"><p className="eyebrow">Matching that thinks ahead</p><h2 className="landing-section-title">We don&apos;t just find a provider. We find the right provider.</h2><p>Every match reflects what matters for your request, so you can choose with confidence instead of scrolling through guesswork.</p><Link to="/login" className="text-indigo-600 font-bold inline-flex items-center gap-2 mt-5">Find your match <ArrowRight size={16} /></Link></div>
        <div className="landing-signals surface">{matchingSignals.map(({ label, icon: Icon }) => <div className="landing-signal" key={label}><Icon size={18} className="text-indigo-600" /><span>{label}</span><CheckCircle2 size={16} className="ml-auto text-emerald-500" /></div>)}</div>
      </section>

      <section className="landing-trust page-wrap">
        <div className="text-center max-w-2xl mx-auto"><p className="eyebrow">Stay in the loop</p><h2 className="landing-section-title">From requested to resolved.</h2><p className="landing-section-note mx-auto mt-3">See every milestone clearly, from the first request to the moment your service is complete.</p></div>
        <div className="landing-timeline">{trackingSteps.map((step, index) => <div className="landing-timeline-step" key={step}><div className={index < 2 ? "is-active" : ""}>{index < 2 ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</div><span>{step}</span></div>)}</div>
      </section>

      <section className="landing-final surface page-wrap"><div><p className="eyebrow">Ready when you are</p><h2 className="landing-section-title">Your home deserves better service.</h2></div><Link to="/login" className="primary-button px-6 py-3 rounded-xl font-bold">Find Your Provider <ArrowRight size={17} /></Link></section>
    </main>
  );
}
