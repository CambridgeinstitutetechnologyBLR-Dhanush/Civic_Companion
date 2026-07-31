'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronRight, Headset, Landmark, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';

const FAQS: { q: string; a: string }[] = [
  { q: 'How do I apply for an Income Certificate?', a: 'Visit the Seva Sindhu portal at sevasindhuservices.karnataka.gov.in, log in with your mobile OTP, search for "Income Certificate", fill the form, upload Aadhaar and address proof, and submit. You will receive an acknowledgement number.' },
  { q: 'What documents are required for a Passport?', a: 'You need: Aadhaar Card, Birth Certificate or 10th Mark Sheet, Address Proof, and Passport Size Photos. Book an appointment at passportindia.gov.in.' },
  { q: 'How long does a Driving Licence take?', a: 'After passing the driving test, the DL is issued within 7–30 working days and may be delivered by post to your registered address.' },
  { q: 'How do I update my Aadhaar address?', a: 'Log in at myaadhaar.uidai.gov.in, select "Update Demographics", choose Address, upload a valid address proof document, and submit. Updates take up to 90 days.' },
  { q: 'How do I get a PAN Card?', a: 'Apply online at protean-tinpan.com, fill Form 49A, upload Aadhaar and photo, and pay the fee (₹107 for Indian address). PAN is issued within 15–20 working days.' },
  { q: 'What is the processing time for a Ration Card?', a: 'Applications are processed within 30–60 working days. Status can be tracked through the Ahara Karnataka portal.' },
  { q: 'How do I register to vote?', a: 'Apply online at voters.eci.gov.in using Form 6 for new registration. You need Aadhaar, age proof (18+), and address proof.' },
  { q: 'How do I get a Caste Certificate?', a: 'Apply via Seva Sindhu with Aadhaar, address proof, and parent caste certificate. The Revenue Department issues it within 15–30 working days.' },
];

const CATEGORIES = ['General', 'Documents', 'Application Status', 'Payment', 'Technical Issue', 'Other'];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [appNo, setAppNo] = useState('');
  const [category, setCategory] = useState('General');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>
          <span style={{ background: '#2563EB', color: '#fff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={16} /></span>
          CivicCompanion · Support
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Headset size={28} color="#2563EB" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>Support Center</h1>
          <p style={{ color: '#64748B', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Get help with your government service applications, documents, and portal issues.</p>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { icon: Phone, label: 'Toll Free', value: '1800-XXX-XXXX', sub: 'Mon–Sat 9AM–6PM', color: '#16A34A', bg: '#DCFCE7' },
            { icon: Mail, label: 'Email', value: 'support@civiccompanion.in', sub: 'Response in 24hrs', color: '#2563EB', bg: '#EEF4FF' },
            { icon: MessageCircle, label: 'Live Chat', value: 'Start Chat', sub: 'Available now', color: '#7C3AED', bg: '#F5F3FF' },
            { icon: MapPin, label: 'Visit Office', value: 'Bengaluru, KA', sub: 'By appointment', color: '#EA580C', bg: '#FFF7ED' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <c.icon size={22} color={c.color} />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>{c.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{c.value}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{c.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Raise a Ticket */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Send size={18} color="#2563EB" /> Raise a Ticket
            </h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: '#16A34A', fontWeight: 700, margin: '0 0 8px' }}>Ticket Submitted!</h3>
                <p style={{ color: '#64748B', fontSize: 14 }}>We&apos;ll respond within 24 hours to {email}.</p>
                <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setAppNo(''); setDesc(''); }} style={{ marginTop: 20, padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Name', value: name, set: setName, placeholder: 'Your full name' },
                  { label: 'Email', value: email, set: setEmail, placeholder: 'your@email.com', type: 'email' },
                  { label: 'Application Number (optional)', value: appNo, set: setAppNo, placeholder: 'e.g. APPL-2026-XXXXX' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                    <input required={!f.label.includes('optional')} type={f.type ?? 'text'} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                      style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Issue Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 14, outline: 'none' }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Describe your issue</label>
                  <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Please describe your issue in detail..."
                    style={{ width: '100%', height: 100, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '12px 14px', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ height: 48, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Send size={16} /> Submit Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={18} color="#2563EB" /> Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '14px 16px', background: openFaq === i ? '#EEF4FF' : '#F8FAFC', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#0F172A', textAlign: 'left', gap: 8 }}>
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronDown size={16} color="#2563EB" /> : <ChevronRight size={16} color="#94A3B8" />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '12px 16px', fontSize: 13, lineHeight: 1.7, color: '#475569', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
