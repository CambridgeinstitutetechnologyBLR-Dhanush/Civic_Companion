'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const submissionLock = useRef(false);
  const updatePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionLock.current) return;
    if (password !== confirmPassword) { setMessage('Passwords do not match.'); return; }
    if (password.length < 8) { setMessage('Choose a password with at least 8 characters.'); return; }
    submissionLock.current = true; setLoading(true); setMessage('');
    const supabase = createClient();
    if (!supabase) { setMessage('Supabase is not configured yet.'); setLoading(false); submissionLock.current = false; return; }
    const { error } = await supabase.auth.updateUser({ password });
    submissionLock.current = false;
    if (error) { setMessage('This reset link may have expired. Request a new password reset link and try again.'); setLoading(false); return; }
    window.location.assign('/dashboard');
  };
  return <main className="auth-page"><section className="auth-card"><Link className="auth-back" href="/login"><ArrowLeft size={16} /> Back to sign in</Link><div className="auth-mark"><Landmark size={23} /></div><span className="section-kicker">NEW PASSWORD</span><h1>Choose a new password</h1><p>Use at least 8 characters and avoid reusing passwords from other sites.</p><form onSubmit={updatePassword}><label htmlFor="password">New password</label><div className="email-field"><LockKeyhole size={18} /><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required disabled={loading} /></div><label htmlFor="confirm-password">Confirm new password</label><div className="email-field"><LockKeyhole size={18} /><input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required disabled={loading} /></div><button className="primary auth-submit" disabled={loading}>{loading && <LoaderCircle className="spinner" size={17} />}{loading ? 'Updating password…' : 'Update password'}</button></form>{message && <p aria-live="polite" className="auth-message error">{message}</p>}<div className="auth-note"><ShieldCheck size={16} /> Your new password is managed securely by Supabase Auth.</div></section></main>;
}
