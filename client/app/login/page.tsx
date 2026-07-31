'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

function loginError(message: string) {
  const value = message.toLowerCase();
  if (value.includes('invalid login credentials')) return 'Incorrect email or password. Please try again.';
  if (value.includes('email not confirmed')) return 'Please confirm your email address before signing in.';
  if (value.includes('rate limit') || value.includes('too many requests')) return 'Too many attempts. Please wait a moment before trying again.';
  return 'We could not sign you in. Please try again.';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const submissionLock = useRef(false);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    if (!supabase) {
      setMessage('Supabase is not configured yet. Add the required values to .env.local.');
      setLoading(false);
      submissionLock.current = false;
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(loginError(error.message));
      setLoading(false);
      submissionLock.current = false;
      return;
    }
    window.location.assign('/dashboard');
  };

  return <main className="auth-page"><section className="auth-card"><Link className="auth-back" href="/"><ArrowLeft size={16} /> Back to Civic Companion</Link><div className="auth-mark"><Landmark size={23} /></div><span className="section-kicker">SECURE ACCESS</span><h1>Welcome back</h1><p>Sign in to save service plans and track applications.</p><form onSubmit={signIn}><label htmlFor="email">Email address</label><div className="email-field"><Mail size={18} /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required disabled={loading} /></div><label htmlFor="password">Password</label><div className="email-field"><LockKeyhole size={18} /><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" minLength={8} required disabled={loading} /></div><Link className="forgot-link" href="/forgot-password">Forgot password?</Link><button className="primary auth-submit" disabled={loading}>{loading && <LoaderCircle className="spinner" size={17} />}{loading ? 'Signing in…' : 'Sign in'}</button></form>{message && <p aria-live="polite" className="auth-message error">{message}</p>}<p className="auth-switch">New to Civic Companion? <Link href="/signup">Create an account</Link></p><div className="auth-note"><ShieldCheck size={16} /> Your password is securely managed by Supabase Auth.</div></section></main>;
}
