'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, CircleAlert,
  Clock3, FileCheck2, Languages, Loader2, MapPin,
  MessageCircle, Phone, Search, Send, ShieldCheck, Sparkles,
} from 'lucide-react';
import { INDIAN_STATES } from '../../lib/stateData';

export type GuidancePlan = {
  service: string;
  state: string;
  purpose: string;
  timeline: string;
  steps: { title: string; description: string }[];
  documents: { name: string; status: string }[];
  office: { name: string; address: string; hours: string; phone: string };
  warning: string;
};

type IntakeProps = {
  service: string;
  onBack: () => void;
  onPlan: (plan: GuidancePlan) => void;
};

export function GuidanceIntake({ service, onBack, onPlan }: IntakeProps) {
  const [purpose, setPurpose] = useState('Education / scholarship');
  const [state, setState] = useState('Karnataka');
  const [hasAadhaar, setHasAadhaar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const prefs = localStorage.getItem('civicPrefs');
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        if (p.state) setState(p.state);
      } catch (e) {}
    }
  }, []);

  const createPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/plans/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, state, purpose, has_aadhaar: hasAadhaar }),
      });
      if (!response.ok) throw new Error('Unable to generate your plan.');
      onPlan(await response.json() as GuidancePlan);
    } catch {
      setError('We could not reach the guidance service. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="flow shell"><div className="flow-head"><button className="back" onClick={onBack}>← Back</button><span className="eyebrow"><Sparkles size={14} /> Personalized guidance</span></div><div className="progress"><div className="active"><span><Check size={14} /></span><small>Service</small></div><div className="active"><span><Check size={14} /></span><small>Your details</small></div><div><span>3</span><small>Your plan</small></div></div><div className="intake-layout"><div className="intake-main"><h1>Let&apos;s tailor your <em>{service.toLowerCase()}</em> plan.</h1><p>Answer a few quick questions. This helps us give you exactly the right guidance.</p><div className="question"><label>Which state do you live in?</label><select value={state} onChange={(event) => setState(event.target.value)}>{INDIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div><div className="question"><label>What is the purpose of your certificate?</label><div className="choice-grid">{['Education / scholarship', 'Job application', 'Government scheme', 'Other purpose'].map((option) => <button type="button" className={purpose === option ? 'chosen' : ''} key={option} onClick={() => setPurpose(option)}>{purpose === option && <Check size={15} />}{option}</button>)}</div></div><div className="question"><label>Do you have a valid Aadhaar card?</label><div className="yes-no"><button type="button" className={hasAadhaar ? 'chosen' : ''} onClick={() => setHasAadhaar(true)}>{hasAadhaar && <Check size={15} />} Yes, I have it</button><button type="button" className={!hasAadhaar ? 'chosen' : ''} onClick={() => setHasAadhaar(false)}>{!hasAadhaar && <Check size={15} />} No, I need help</button></div></div>{error && <p className="form-error">{error}</p>}<button className="primary continue" onClick={createPlan} disabled={loading}>{loading ? 'Creating your plan…' : 'Create my action plan'} <ArrowRight size={17} /></button></div><aside className="help-card"><span className="help-icon">✨</span><h3>You&apos;re in good hands</h3><p>We&apos;ll check your details and help you avoid common application mistakes.</p><div><ShieldCheck size={17} /> Your information stays private</div></aside></div></section>;
}

export function GuidancePlanView({ plan, onHome }: { plan: GuidancePlan; onHome: () => void }) {
  const [showChat, setShowChat] = useState(false);
  return <section className="plan shell"><div className="flow-head"><button className="back" onClick={onHome}>← Start over</button><span className="eyebrow"><CheckCircle2 size={14} /> Your plan is ready</span></div><div className="plan-title"><div><span className="section-kicker">PERSONALIZED FOR YOU</span><h1>Your {plan.service.toLowerCase()} plan</h1><p>For {plan.purpose.toLowerCase()} · {plan.state} · Applicant</p></div><button className="primary" onClick={() => setShowChat(!showChat)}><MessageCircle size={17} /> {showChat ? 'Hide AI chat' : 'Ask AI'}</button></div>{showChat && <PlanChat plan={plan} />}<div className="plan-grid"><div><section className="panel"><div className="panel-head"><div><span className="panel-icon"><FileCheck2 size={19} /></span><h2>Your next steps</h2></div><span className="estimate"><Clock3 size={14} /> {plan.timeline}</span></div>{plan.steps.map((step, index) => <div className="plan-step" key={step.title}><span>{index + 1}</span><div><b>{step.title}</b><small>{step.description}</small></div></div>)}</section><section className="panel"><div className="panel-head"><div><span className="panel-icon green"><CheckCircle2 size={19} /></span><h2>Document checklist</h2></div></div>{plan.documents.map((document) => <div className="document" key={document.name}><span className={document.status === 'available' ? 'ready' : 'needed'}>{document.status === 'available' ? <Check size={15} /> : <CircleAlert size={15} />}</span><b>{document.name}</b><small>{document.status === 'available' ? 'Ready' : 'To prepare'}</small></div>)}</section></div><aside><section className="office-card"><div className="map"><MapPin size={25} /><span>Nearest office</span></div><div className="office-body"><span className="section-kicker">YOUR NEAREST CENTRE</span><h3>{plan.office.name}</h3><p><MapPin size={15} /> {plan.office.address}</p><p><Clock3 size={15} /> {plan.office.hours}</p><p><Phone size={15} /> {plan.office.phone}</p></div></section><section className="warning"><CircleAlert size={20} /><div><b>Before you apply</b><p>{plan.warning}</p></div></section><section className="language-card"><Languages size={20} /><div><b>Need help at the office?</b><p>Get a Kannada script to use with officials.</p></div></section></aside></div></section>;
}

// ─── Premium AI Chat ──────────────────────────────────────────────────────────

const MAX_CHARS = 200;

const SUGGESTIONS = [
  { emoji: '📄', label: 'Required Documents', text: 'What documents are required?' },
  { emoji: '✅', label: 'Eligibility',        text: 'Am I eligible to apply?' },
  { emoji: '💰', label: 'Government Fees',    text: 'What are the government fees?' },
  { emoji: '⏳', label: 'Processing Time',    text: 'How long does processing take?' },
  { emoji: '📍', label: 'Nearby Office',      text: 'Where is the nearest government office?' },
  { emoji: '📋', label: 'Track Application',  text: 'How do I track my application status?' },
  { emoji: '🌐', label: 'Official Website',   text: 'What is the official website to apply?' },
];

type ChatMessage = { role: 'user' | 'assistant'; text: string };

function PlanChat({ plan }: { plan: GuidancePlan }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const ask = async (questionText?: string) => {
    const q = (questionText ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/chat`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ service: plan.service, state: plan.state, message: q }) },
      );
      const data = await res.json() as { answer?: string };
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer ?? 'Sorry, I could not answer that right now.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Unable to reach the guidance service. Please ensure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: 0, marginBottom: 24, overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.07)', animation: 'chatSlideUp 0.25s ease-out' }}>
      <style>{`
        @keyframes chatSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ai-input:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        .chip-btn:hover { background: #EEF4FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
        .ask-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,0.35) !important; }
        .ask-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .spin-icon { animation: spin 1s linear infinite; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid #F1F5F9', background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageCircle size={20} color="#fff" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>Ask about your application</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748B', lineHeight: 1.4 }}>
              Get instant answers on documents, eligibility, fees, processing time &amp; office locations.
            </p>
          </div>
        </div>
      </div>

      {/* ── Chat history ── */}
      {messages.length > 0 && (
        <div style={{ maxHeight: 340, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, background: '#F8FAFC' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start', animation: 'bubbleIn 0.2s ease-out' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Sparkles size={15} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '78%', padding: '10px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#0F172A',
                fontSize: 14, lineHeight: 1.65,
                boxShadow: msg.role === 'user' ? '0 2px 8px rgba(37,99,235,0.25)' : '0 1px 4px rgba(0,0,0,0.08)',
                border: msg.role === 'assistant' ? '1px solid #E2E8F0' : 'none',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.role === 'assistant' && (
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563EB' }}>Civic AI</p>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', animation: 'bubbleIn 0.2s ease-out' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={15} color="#fff" />
              </div>
              <div style={{ padding: '10px 18px', background: '#fff', borderRadius: '4px 18px 18px 18px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={15} color="#2563EB" className="spin-icon" />
                <span style={{ fontSize: 13, color: '#64748B', fontStyle: 'italic' }}>Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* ── Input area ── */}
      <div style={{ padding: '20px 24px', borderTop: messages.length > 0 ? '1px solid #F1F5F9' : 'none' }}>
        {/* Suggestion chips (shown before first message) */}
        {messages.length === 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ✨ Quick Questions
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button key={s.label} className="chip-btn" onClick={() => ask(s.text)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 500, color: '#475569', cursor: 'pointer', transition: 'all 0.15s ease-out' }}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text input with character counter */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
            placeholder={`e.g. What documents are required for ${plan.service}?`}
            aria-label="Ask a question about your application"
            style={{ width: '100%', height: 56, padding: '0 80px 0 50px', borderRadius: 14, border: '1.5px solid #E2E8F0', fontSize: 14, color: '#0F172A', background: '#F8FAFC', boxSizing: 'border-box', transition: 'all 0.2s ease-out' }}
          />
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: input.length >= MAX_CHARS * 0.85 ? '#F59E0B' : '#CBD5E1', fontVariantNumeric: 'tabular-nums', pointerEvents: 'none' }}>
            {input.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Trust banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', marginBottom: 12 }}>
          <ShieldCheck size={16} color="#2563EB" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1E40AF' }}>Official Government AI Assistant</p>
            <p style={{ margin: '1px 0 0', fontSize: 11, color: '#3B82F6', lineHeight: 1.4 }}>Provides guidance using publicly available official government information.</p>
          </div>
        </div>

        {/* Ask button */}
        <button
          className="ask-btn"
          onClick={() => ask()}
          disabled={loading || !input.trim()}
          aria-label="Submit question to AI"
          style={{ width: '100%', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'all 0.2s ease-out' }}
        >
          {loading
            ? <><Loader2 size={18} className="spin-icon" /> Thinking…</>
            : <><Send size={17} /> Ask AI</>}
        </button>

        {/* Compact chips after first message */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button key={s.label} className="chip-btn" onClick={() => ask(s.text)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#475569', cursor: 'pointer', transition: 'all 0.15s ease-out' }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
