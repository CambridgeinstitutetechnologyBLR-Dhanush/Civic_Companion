'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const submissionLock = useRef(false);

  const signUp = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionLock.current) return;
    if (password !== confirmPassword) { setMessage('Passwords do not match.'); return; }
    if (password.length < 8) { setMessage('Choose a password with at least 8 characters.'); return; }
    submissionLock.current = true;
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    if (!supabase) { setMessage('Supabase is not configured yet. Add the required values to .env.local.'); setLoading(false); submissionLock.current = false; return; }
    const { data, error } = await supabase.auth.signUp({ email, password });
    submissionLock.current = false;
    if (error) { setMessage(error.message.includes('rate limit') ? 'Too many sign-up emails were requested. Please wait and try again.' : 'We could not create your account. Please try again.'); setLoading(false); return; }
    if (data.session) { window.location.assign('/dashboard'); return; }
    setSuccess(true);
    setMessage('Your account was created, but this Supabase project requires email confirmation. For local development, disable Confirm email in Supabase Authentication → Providers → Email, then create a new account to sign in immediately.');
    setLoading(false);
  };

  return <main className="auth-page"><section className="auth-card"><Link className="auth-back" href="/login"><ArrowLeft size={16} /> Back to sign in</Link><div className="auth-mark"><Landmark size={23} /></div><span className="section-kicker">CREATE ACCOUNT</span><h1>Get started</h1><p>Save personalized plans and manage your application progress.</p><form onSubmit={signUp}><label htmlFor="email">Email address</label><div className="email-field"><Mail size={18} /><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required disabled={loading || success} /></div><label htmlFor="password">Password</label><div className="email-field"><LockKeyhole size={18} /><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required disabled={loading || success} /></div><label htmlFor="confirm-password">Confirm password</label><div className="email-field"><LockKeyhole size={18} /><input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" minLength={8} required disabled={loading || success} /></div><button className="primary auth-submit" disabled={loading || success}>{loading && <LoaderCircle className="spinner" size={17} />}{loading ? 'Creating account…' : 'Create account'}</button></form>{message && <p aria-live="polite" className={success ? 'auth-message' : 'auth-message error'}>{message}</p>}<p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p><div className="auth-note"><ShieldCheck size={16} /> Passwords are handled securely by Supabase Auth.</div></section></main>;
}
