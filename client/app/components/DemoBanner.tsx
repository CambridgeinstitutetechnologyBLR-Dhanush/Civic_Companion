'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, X } from 'lucide-react';
import Link from 'next/link';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('demoBannerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const dismiss = () => {
    localStorage.setItem('demoBannerDismissed', 'true');
    setIsVisible(false);
  };

  return (
    <div className="bg-[#FEF3C7] border-b border-[#FCD34D] px-4 py-3 sm:px-6 lg:px-8 relative z-[60]">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200/50 text-amber-700 mt-0.5 sm:mt-0">
            <FlaskConical size={16} />
          </div>
          <p className="text-sm text-amber-900 leading-snug">
            <strong>Demo Mode:</strong> This is a hackathon prototype. Some application statuses, timelines, and dashboards use sample data for demonstration. Official applications are submitted through the respective government portals.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <Link href="/about" onClick={dismiss} className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2">
            Learn More
          </Link>
          <button 
            onClick={dismiss}
            className="flex items-center gap-1.5 rounded-lg bg-amber-200/50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-300/50"
          >
            <X size={14} /> Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
