'use client';

import { X, Mail, ShieldCheck, Download, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onSuccessRedirect?: string; // Where to go after login if we need to
};

export default function LoginModal({ isOpen, onClose, title = 'Login Required', onSuccessRedirect }: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    // Navigate to actual login page and pass the redirect URL
    const url = new URL('/login', window.location.origin);
    if (onSuccessRedirect) {
      url.searchParams.set('redirectTo', onSuccessRedirect);
    } else {
      url.searchParams.set('redirectTo', window.location.pathname + window.location.search);
    }
    router.push(url.pathname + url.search);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-8 text-center border-b border-slate-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <ShieldCheck size={28} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue with this action.</p>
        </div>

        <div className="bg-slate-50 p-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Benefits of creating an account</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span> Save your application progress
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span> Track live status updates
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span> <Download size={14} className="text-slate-400" /> Download certificates
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span> <Bell size={14} className="text-slate-400" /> Receive SMS/Email notifications
            </li>
          </ul>

          <div className="space-y-3">
            <button 
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-600/20"
            >
              Continue with Email or Google
            </button>
            <button 
              onClick={onClose}
              className="w-full rounded-xl bg-white p-3.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
