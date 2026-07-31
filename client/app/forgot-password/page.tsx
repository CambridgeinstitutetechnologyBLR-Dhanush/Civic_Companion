'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submissionLock = useRef(false);

  const requestReset = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    if (!supabase) { setMessage('Supabase is not configured yet. Add the required values to .env.local.'); setLoading(false); submissionLock.current = false; return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
    submissionLock.current = false;
    if (error) { setMessage(error.message.toLowerCase().includes('rate limit') ? 'Too many reset emails were requested. Please wait and try again.' : 'We could not send a reset email. Please try again.'); setLoading(false); return; }
    setSent(true);
    setLoading(false);
    setMessage('If an account exists for this email, you will receive a password-reset link shortly.');
  };

  return <main className="auth-page"><section className="auth-card"><Link className="auth-back" href="/login"><ArrowLeft size={16} /> Back to sign in</Link><div className="auth-mark"><Landmark size={23} /></div><span className="section-kicker">PASSWORD RECOVERY</span><h1>Reset your password</h1><p>Enter your email and we&apos;ll send secure reset instructions.</p><form onSubmit={requestReset}><label htmlFor="email">Email address</label><div className="email-field"><Mail size={18} /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required disabled={loading || sent} /></div><button className="primary auth-submit" disabled={loading || sent}>{loading && <LoaderCircle className="spinner" size={17} />}{loading ? 'Sending instructions…' : 'Send reset instructions'}</button></form>{message && <p aria-live="polite" className={sent ? 'auth-message' : 'auth-message error'}>{message}</p>}<div className="auth-note"><ShieldCheck size={16} /> Reset links are time-limited and can be used only to update your password.</div></section></main>;
}
