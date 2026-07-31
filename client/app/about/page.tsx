import Link from 'next/link';
import {
  ArrowRight, BadgeCheck, Bell, Building2, CheckCircle2, CreditCard, FileText,
  Fingerprint, Globe, Headset, Landmark, MapPin, Phone, Mail, ShieldCheck,
  Sparkles, Users, Wallet,
} from 'lucide-react';

export const metadata = {
  title: 'About Us — Civic Companion',
  description: 'Learn about Civic Companion, a digital government services platform helping Indian citizens access certificates, offices, and official portals faster.',
};

const FEATURES = [
  { icon: FileText,   title: 'Certificate Guidance',      description: 'Step-by-step guidance for Income, Caste, Birth, and 7 more certificates.' },
  { icon: MapPin,     title: 'Nearby Government Offices', description: 'Auto-detect your location and find the closest Nadakacheri, RTO, PSK, and more.' },
  { icon: Globe,      title: 'Official Government Links', description: 'Direct "Apply Online" buttons linked to verified government portals only.' },
  { icon: FileText,   title: 'Application Tracking',      description: 'Save your application plan and track its progress from the dashboard.' },
  { icon: Bell,       title: 'Smart Notifications',       description: 'Get notified when your application status changes or documents are due.' },
  { icon: Headset,    title: 'Citizen Support',           description: 'Guided Q&A to help you navigate common government service challenges.' },
];

const WHY_US = [
  'Official Government Resources Only',
  'Accurate and Up-to-Date Information',
  'Location-Based Office Finder',
  'Secure Supabase Authentication',
  'Mobile Responsive Design',
  'Fast, Clutter-Free Navigation',
  'No Advertisements or Middlemen',
  'Built for Every Indian Citizen',
];

const STATS = [
  { value: '10+',  label: 'Government Services' },
  { value: '100%', label: 'Official Links Only'  },
  { value: '24/7', label: 'Guidance Available'   },
  { value: '📍',   label: 'Location-Based Support' },
];

export default function AboutPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0F172A', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: '#0F172A', textDecoration: 'none' }}>
          <span style={{ background: '#2563EB', color: '#fff', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={18} />
          </span>
          CivicCompanion
        </Link>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/#services" style={{ color: '#64748B', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Services</Link>
          <Link href="/about" style={{ color: '#2563EB', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>About Us</Link>
          <Link href="/login" style={{ background: '#2563EB', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600 }}>Log In</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)', padding: '80px 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '6px 16px', marginBottom: 24, fontSize: 13, fontWeight: 600 }}>
            <Sparkles size={14} /> Government Services Portal
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px' }}>
            Helping Citizens Access<br />Government Services Faster
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', maxWidth: 560, margin: '0 auto 36px' }}>
            Civic Companion simplifies India&apos;s government services by providing personalized guidance, verified documents lists, nearby offices, and official application links — all in one place.
          </p>
          <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1E3A8A', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'transform 0.15s' }}>
            Explore Services <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#1E3A8A', padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {STATS.map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#93C5FD', marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ maxWidth: 800, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEF4FF', color: '#2563EB', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          Our Mission
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 20 }}>
          Making Government Services Accessible to Every Indian
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#475569', maxWidth: 640, margin: '0 auto' }}>
          Millions of Indians struggle navigating complex government processes — wrong offices, missing documents, unclear eligibility. Civic Companion solves this by providing structured guidance for each service, pointing citizens directly to the right office and the right portal with the right documents.
        </p>
      </section>

      {/* ── What We Offer ── */}
      <section style={{ background: '#fff', padding: '80px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEF4FF', color: '#2563EB', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              What We Offer
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 12 }}>Everything You Need in One Place</h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Purpose-built features that guide citizens from eligibility to application submission.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: '#F8FAFC', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', transition: 'all 0.2s ease-out', cursor: 'default' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={24} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#0F172A' }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#64748B', margin: 0 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ maxWidth: 1100, margin: '80px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEF4FF', color: '#2563EB', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              Why Choose Us
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
              Built on Trust, Accuracy, and Accessibility
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#475569', marginBottom: 32 }}>
              Every piece of information on Civic Companion links to an official Government of India or Karnataka Government source. No guesswork. No middlemen. Just verified guidance.
            </p>
            <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Start Using Free <ArrowRight size={15} />
            </Link>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {WHY_US.map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, color: '#0F172A', fontWeight: 500 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <section style={{ background: '#1E3A8A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', color: '#fff' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, color: '#93C5FD' }}>
            Contact Us
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16 }}>We&apos;re Here to Help</h2>
          <p style={{ color: '#93C5FD', fontSize: 15, marginBottom: 48 }}>Have a question about a service, or want to report an issue? Reach out.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'left' }}>
            {[
              { icon: Mail,     label: 'Email',         value: 'support@civiccompanion.in' },
              { icon: Phone,    label: 'Phone',         value: '+91 80 2222 0000' },
              { icon: Building2,label: 'Address',       value: 'Bengaluru, Karnataka, India' },
              { icon: Headset,  label: 'Support Hours', value: 'Mon–Sat · 9 AM – 6 PM' },
            ].map(c => (
              <div key={c.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <c.icon size={20} color="#93C5FD" />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#93C5FD', margin: '0 0 6px' }}>{c.label}</p>
                <p style={{ fontSize: 14, color: '#fff', margin: 0, fontWeight: 500 }}>{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0F172A', padding: '32px 24px', textAlign: 'center', color: '#64748B', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, color: '#fff', fontWeight: 700, fontSize: 16 }}>
          <span style={{ background: '#2563EB', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={16} /></span>
          CivicCompanion
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
          <Link href="/services" style={{ color: '#94A3B8', textDecoration: 'none' }}>Services</Link>
          <Link href="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About Us</Link>
          <Link href="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>Login</Link>
        </div>
        <p style={{ margin: 0 }}>© 2026 Civic Companion AI · Made for every citizen, everywhere.</p>
      </footer>
    </main>
  );
}
