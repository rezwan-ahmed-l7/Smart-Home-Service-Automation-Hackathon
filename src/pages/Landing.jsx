import { Link } from "react-router-dom";
import {
  ArrowRight, CalendarCheck, CheckCircle2, Clock3, Compass, MapPin,
  ShieldCheck, Star, Wrench,
} from "lucide-react";

const features = [
  { title: "Smart Matching", text: "Compare providers by fit, rating, distance, price, and expertise.", icon: Compass },
  { title: "Flexible Scheduling", text: "Choose a time that works for your home and your day.", icon: CalendarCheck },
  { title: "Live Service Tracking", text: "Know what is happening from request to completion.", icon: MapPin },
  { title: "Secure Payment Options", text: "Pay online or choose cash on service when it suits you.", icon: ShieldCheck },
];
const steps = ["Tell us what you need", "Get smart matches", "Book your provider", "Track the service"];

export default function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-hero page-wrap">
        <div className="landing-hero-copy">
          <p className="eyebrow">Smart home care, made simple</p>
          <h1 className="landing-title">Home problems.<br /><span>Smarter solutions.</span></h1>
          <p className="landing-lede">Find trusted service professionals, compare smart matches, schedule effortlessly, and track every step.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/login" className="primary-button px-6 py-3 rounded-xl font-bold">Get Started <ArrowRight size={17} /></Link>
          </div>
          <p className="landing-signin">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        <div className="landing-hero-art surface" aria-label="Service tracking preview">
          <div className="landing-art-orbit landing-orbit-one" />
          <div className="landing-art-orbit landing-orbit-two" />
          <div className="landing-art-topline"><span className="eyebrow">Service in progress</span><span className="landing-live-pill"><span /> Live</span></div>
          <div className="landing-art-card">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-gray-500">Today&apos;s request</p><h2 className="text-lg font-bold text-gray-900 mt-1">AC maintenance</h2></div><CheckCircle2 className="text-emerald-500" size={22} /></div>
            <div className="landing-progress"><span /></div>
            <div className="flex justify-between text-xs text-gray-500"><span>Provider on the way</span><strong className="text-indigo-600">12 min away</strong></div>
          </div>
          <div className="landing-art-match"><div className="landing-avatar"><Star size={17} fill="currentColor" /></div><div><p className="text-xs text-gray-500">Smart match</p><p className="font-bold text-gray-900">Top-rated nearby pro</p></div></div>
        </div>
      </section>

      <section className="landing-section page-wrap">
        <div className="landing-section-heading"><div><p className="eyebrow">How it works</p><h2 className="landing-section-title">From problem to progress.</h2></div><p className="landing-section-note">A clear, guided experience for getting reliable help at home.</p></div>
        <div className="landing-steps">{steps.map((step, index) => <div className="landing-step" key={step}><span>0{index + 1}</span><div className="landing-step-icon">{index === 0 ? <Wrench size={19} /> : index === 1 ? <Compass size={19} /> : index === 2 ? <CalendarCheck size={19} /> : <Clock3 size={19} />}</div><p>{step}</p></div>)}</div>
      </section>

      <section className="landing-feature page-wrap">
        <div className="landing-feature-copy"><p className="eyebrow">One platform, less stress</p><h2 className="landing-section-title">Good service should feel straightforward.</h2><p>Everything you need to make a confident choice and stay informed, without the endless calls and guesswork.</p></div>
        <div className="landing-signals surface">{features.map(({ title, text, icon: Icon }) => <div className="landing-signal" key={title}><div className="landing-signal-icon"><Icon size={18} /></div><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
      </section>

      <section className="landing-final surface page-wrap"><div><p className="eyebrow">Ready when you are</p><h2 className="landing-section-title">Ready to solve your next home problem?</h2></div><Link to="/login" className="primary-button px-6 py-3 rounded-xl font-bold">Get Started <ArrowRight size={17} /></Link></section>
    </main>
  );
}
