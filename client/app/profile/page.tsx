'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Globe, Landmark, LogOut, Save, Shield, User, UserCog } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { INDIAN_STATES } from '../../lib/stateData';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [district, setDistrict] = useState('');
  const [lang, setLang] = useState('en');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setEmail(data.user.email ?? '');
      });
    }
    // Restore preferences from localStorage
    const prefs = localStorage.getItem('civicPrefs');
    if (prefs) {
      const p = JSON.parse(prefs);
      if (p.lang) setLang(p.lang);
      if (p.state) setSelectedState(p.state);
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.district) setDistrict(p.district);
    }
  }, []);

  const save = () => {
    localStorage.setItem('civicPrefs', JSON.stringify({ lang, state: selectedState, name, phone, district }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    window.location.assign('/login');
  };

  const initial = email.charAt(0).toUpperCase() || 'U';

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>
            <span style={{ background: '#2563EB', color: '#fff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={16} /></span>
            CivicCompanion
          </div>
        </div>
        <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#fff', color: '#DC2626', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          <LogOut size={15} /> Sign Out
        </button>
      </header>

      {saved && (
        <div style={{ background: '#16A34A', color: '#fff', textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 600 }}>
          ✓ Preferences saved successfully!
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {initial}
          </div>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{name || 'Your Name'}</h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DCFCE7', color: '#16A34A', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
              <Shield size={13} /> Verified
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Personal Info */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={18} color="#2563EB" /> Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Full Name', value: name, set: setName, placeholder: 'Enter your full name' },
                { label: 'Phone Number', value: phone, set: setPhone, placeholder: '+91 XXXXX XXXXX' },
                { label: 'District', value: district, set: setDistrict, placeholder: 'Your district' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                <input value={email} disabled style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, boxSizing: 'border-box', background: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed' }} />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserCog size={18} color="#2563EB" /> Preferences
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* State */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your State</label>
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
                  style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, outline: 'none', background: '#F8FAFC' }}>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Language */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  <Globe size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Interface Language
                </label>
                <select value={lang} onChange={e => setLang(e.target.value)}
                  style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, outline: 'none', background: '#F8FAFC' }}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.native} ({l.label})</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={18} color="#2563EB" /> Notification Preferences
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Email Notifications', sub: 'Receive updates about your applications via email', value: notifEmail, set: setNotifEmail },
                { label: 'SMS Notifications', sub: 'Receive SMS alerts for status changes', value: notifSms, set: setNotifSms },
              ].map(n => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{n.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{n.sub}</p>
                  </div>
                  <button onClick={() => n.set(!n.value)} style={{ width: 48, height: 26, borderRadius: 100, background: n.value ? '#2563EB' : '#E2E8F0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: n.value ? 24 : 4, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Save */}
          <button onClick={save} style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'all 0.2s' }}>
            <Save size={17} /> Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
