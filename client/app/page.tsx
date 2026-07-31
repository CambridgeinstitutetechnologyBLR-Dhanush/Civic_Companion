'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Baby, BadgeCheck, Car, CarFront, Check, CheckCircle2,
  ChevronRight, CircleAlert, Clock3, CreditCard, FileCheck2, FileText,
  FileWarning, Fingerprint, Landmark, Languages, MapPin, Menu,
  MessageCircle, Phone, Plane, Search, ShieldCheck, ShoppingBasket,
  Sparkles, Vote, Wallet, X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GuidanceIntake, GuidancePlanView, type GuidancePlan } from './components/guidance-flow';
import { fetchGovernmentServices, type GovernmentService } from '../lib/services';
import LanguageSelector from './components/LanguageSelector';

// ─── Icon map — keyed by slug ────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  'income-certificate': Wallet,
  'caste-certificate':  BadgeCheck,
  'birth-certificate':  Baby,
  'death-certificate':  FileWarning,
  'driving-license':    CarFront,
  'passport':           Plane,
  'voter-id':           Vote,
  'pan-card':           CreditCard,
  'aadhaar-update':     Fingerprint,
  'ration-card':        ShoppingBasket,
};

// ─── Apply Online URL map ────────────────────────────────────────────────────
const APPLY_URLS: Record<string, string> = {
  'Income Certificate': 'https://sevasindhuservices.karnataka.gov.in/',
  'Caste Certificate':  'https://sevasindhuservices.karnataka.gov.in/',
  'Birth Certificate':  'https://crsorgi.gov.in/',
  'Death Certificate':  'https://crsorgi.gov.in/',
  'Driving License':    'https://parivahan.gov.in/',
  'Passport':           'https://www.passportindia.gov.in/',
  'Voter ID':           'https://voters.eci.gov.in/',
  'PAN Card':           'https://www.protean-tinpan.com/',
  'Aadhaar Update':     'https://myaadhaar.uidai.gov.in/',
  'Ration Card':        'https://ahara.karnataka.gov.in/',
};

const steps = ['Service', 'Your details', 'Your plan'];

export default function Home() {
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('Income Certificate');
  const [screen, setScreen] = useState<'home' | 'intake' | 'plan'>('home');
  const [menu, setMenu] = useState(false);
  const [plan, setPlan] = useState<GuidancePlan | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    fetchGovernmentServices().then((catalog) => {
      if (!active) return;
      setServices(catalog);
      if (catalog.length > 0 && !catalog.some((service) => service.name === selected)) {
        setSelected(catalog[0].name);
      }
    });
    return () => { active = false; };
  }, []);

  const begin = (service = selected) => {
    setSelected(service);
    setScreen('intake');
    window.scrollTo(0, 0);
  };

  return (
    <main>
      <header className="nav shell">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Civic Companion home">
          <span className="brand-mark"><Landmark size={19} /></span>
          <span>Civic<span>Companion</span></span>
        </button>
        <nav className={menu ? 'open' : ''}>
          <a href="#services">{t('navigation.services')}</a>
          <a href="#how-it-works">How it works</a>
          <Link href="/about">About us</Link>
          <a className="login" href="/login">Log in</a>
          <LanguageSelector />
          <button className="nav-cta" onClick={() => begin()}>{t('home.get_started')} <ArrowRight size={16} /></button>
        </nav>
        <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
      </header>

      {screen === 'home' && <HomeView services={services} query={query} setQuery={setQuery} begin={begin} />}
      {screen === 'intake' && (
        <GuidanceIntake
          service={selected}
          onBack={() => setScreen('home')}
          onPlan={(newPlan) => {
            setPlan(newPlan);
            setScreen('plan');
            window.scrollTo(0, 0);
          }}
        />
      )}
      {screen === 'plan' && plan && <GuidancePlanView plan={plan} onHome={() => setScreen('home')} />}

      <footer className="footer shell">
        <span>© 2026 Civic Companion AI</span>
        <span className="footer-links">
          <Link href="/about" className="footer-link">About Us</Link>
          <span>·</span>
          <a href="/login" className="footer-link">Login</a>
          <span>·</span>
          <a href="/dashboard" className="footer-link">Dashboard</a>
        </span>
        <span>Made for every citizen, everywhere.</span>
      </footer>
    </main>
  );
}

function ServiceIcon({ slug }: { slug: string }) {
  const Icon = ICON_MAP[slug] ?? FileText;
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EEF4FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.2s ease-out',
      }}
      className="service-icon-container"
    >
      <Icon size={28} color="#2563EB" />
    </div>
  );
}

function HomeView({ services, query, setQuery, begin }: { services: GovernmentService[]; query: string; setQuery: (x: string) => void; begin: (x?: string) => void }) {
  const { t } = useTranslation();
  const filtered = services.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  return <>
    <section className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14} /> Your guide to public services</div>
        <h1 dangerouslySetInnerHTML={{ __html: t('home.hero_title') }}></h1>
        <p>{t('home.hero_subtitle')}</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => begin()}><Sparkles size={18} /> {t('home.get_started')} <ArrowRight size={17} /></button>
          <Link href="/about" className="watch"><span>▶</span> Learn more</Link>
        </div>
        <div className="trust">
          <span><CheckCircle2 size={17} /> Free to use</span>
          <span><CheckCircle2 size={17} /> Available in your language</span>
          <span><CheckCircle2 size={17} /> Built for India</span>
        </div>
      </div>
      <div className="hero-art" aria-label="Personalized guidance preview">
        <div className="dot dot-a" /><div className="dot dot-b" /><div className="dot dot-c" />
        <div className="phone">
          <div className="phone-head"><span className="mini-mark"><Landmark size={12} /></span><div><b>Civic Companion</b><small>Here to help you</small></div><span className="online">●</span></div>
          <div className="chat"><div className="bubble user">I need an income certificate.</div><div className="bubble bot">I can help with that! Let&apos;s make sure you have everything you need. <span>✨</span></div><div className="quick">I&apos;m a student <ChevronRight size={14} /></div><div className="quick">I&apos;m employed <ChevronRight size={14} /></div></div>
          <div className="phone-input">Type your message <span>➤</span></div>
        </div>
        <div className="float-card steps-card"><span className="float-icon blue"><FileCheck2 size={17} /></span><div><b>Your personalized plan</b><small>Ready in minutes</small></div><CheckCircle2 size={18} /></div>
        <div className="float-card lang-card"><span className="float-icon yellow"><Languages size={17} /></span><div><b>English · ಕನ್ನಡ · हिंदी</b><small>Speak your language</small></div></div>
      </div>
    </section>

    <section className="services-section" id="services"><div className="shell"><div className="section-top"><div><span className="section-kicker">POPULAR SERVICES</span><h2>What do you need help with?</h2><p>Choose a service to get started with personalized guidance.</p></div><button className="view-all">View all services <ArrowRight size={16} /></button></div>
      <div className="search"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for a service..." /></div>
      <div className="service-grid">
        {filtered.map(s => {
          const slug = s.slug ?? s.id ?? s.name.toLowerCase().replace(/\s+/g, '-');
          const Icon = ICON_MAP[slug] ?? FileText;
          const translatedName = t(`services.${slug.replace(/-/g, '_')}`, { defaultValue: s.name });
          return (
            <button key={s.name} className="service-card" onClick={() => begin(s.name)}>
              <span className={`service-icon ${s.tone ?? 'blue'}`}>
                <Icon size={26} />
              </span>
              <span><b>{translatedName}</b><small>Get guidance <ArrowRight size={13} /></small></span>
            </button>
          );
        })}
      </div>
    </div></section>

    <section className="how shell" id="how-it-works"><span className="section-kicker">HOW IT WORKS</span><h2>Your path to getting things done.</h2><div className="how-grid"><How n="01" icon={<MessageCircle />} title="Tell us what you need" text="Simply describe what you want to apply for, in your own words." /><How n="02" icon={<Sparkles />} title="Answer a few questions" text="We understand your situation and identify what matters." /><How n="03" icon={<FileCheck2 />} title="Get your action plan" text="Follow clear steps, prepare documents, and apply with confidence." /></div></section>
  </>;
}

function How({ n, icon, title, text }: { n: string; icon: React.ReactNode; title: string; text: string }) { return <div className="how-card"><span className="how-number">{n}</span><div className="how-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>; }
