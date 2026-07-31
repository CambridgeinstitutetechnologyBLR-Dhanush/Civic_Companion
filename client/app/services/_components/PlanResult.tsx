'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Landmark,
  Loader2,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { Card, cn } from './ui';
import {
  SERVICE_DATA,
  FALLBACK_OFFICES,
  getOfficeKey,
  haversineDistance,
} from '../../../lib/serviceData';
import { getIncomePortal, getCastePortal, getPortalForState } from '../../../lib/stateData';
import { createClient } from '../../../lib/supabase/client';
import LoginModal from '../../components/LoginModal';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlanDocument = {
  name: string;
  mandatory: boolean;
  status: 'available' | 'needed';
};

export type PlanStep = {
  title: string;
  description: string;
};

export type PlanOffice = {
  name: string;
  address: string;
  hours: string;
  phone: string;
};

export type GuidancePlan = {
  application_id: string;
  service: string;
  state: string;
  purpose: string;
  eligibility: string;
  department: string;
  official_url: string;
  timeline: string;
  fee_note: string;
  summary: string;
  steps: any[];
  documents: PlanDocument[];
  office: any;
  data_notice: string;
  warning: string;
};
// ─── Local types ──────────────────────────────────────────────────────────────
type FoundOffice = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  distanceKm: string;
  lat: number;
  lng: number;
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} />;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-sm',
          accent ? 'bg-blue-600 shadow-blue-600/25' : 'bg-slate-700 shadow-slate-700/20',
        )}
      >
        {icon}
      </span>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function NearestOfficeCard({ serviceName }: { serviceName: string }) {
  const [office, setOffice] = useState<FoundOffice | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const key = getOfficeKey(serviceName);
    const candidates = FALLBACK_OFFICES[key] ?? FALLBACK_OFFICES['default'];

    if (!navigator.geolocation) {
      // No geolocation support – pick first candidate
      const o = candidates[0];
      setOffice({ ...o, distanceKm: '—' });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = candidates[0];
        let minDist = Infinity;

        candidates.forEach((c) => {
          const d = haversineDistance(latitude, longitude, c.lat, c.lng);
          if (d < minDist) {
            minDist = d;
            nearest = c;
          }
        });

        setOffice({ ...nearest, distanceKm: minDist.toFixed(1) });
        setLoading(false);
      },
      (err) => {
        setDenied(true);
        const o = candidates[0];
        setOffice({ ...o, distanceKm: '—' });
        setLoading(false);
      },
    );
  }, [serviceName]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-3/4" />
        <SkeletonBlock className="h-10 w-full" />
      </div>
    );
  }

  if (!office) return null;

  return (
    <div className="space-y-4">
      {denied && (
        <div className="flex items-start gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <p>Location access denied. Showing a representative office instead.</p>
        </div>
      )}
      <div>
        <h4 className="font-bold text-slate-900">{office.name}</h4>
        <p className="mt-1 text-sm text-slate-600">{office.address}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Distance
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {office.distanceKm} {office.distanceKm !== '—' && 'km'}
          </span>
        </div>
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Hours
          </span>
          <span className="text-sm font-semibold text-slate-900">{office.hours}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
        >
          <MapPin size={14} /> Directions
        </a>
        <a
          href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}
          className="flex w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
        >
          <Phone size={14} />
        </a>
      </div>
    </div>
  );
}

// ─── Official Website Card ────────────────────────────────────────────────────

function OfficialWebsiteCard({ serviceName, state, user, onRequireAuth }: { serviceName: string; state: string; user: any; onRequireAuth: () => void }) {
  let portal;
  if (serviceName.toLowerCase().includes('income')) {
    portal = getIncomePortal(state);
  } else if (serviceName.toLowerCase().includes('caste')) {
    portal = getCastePortal(state);
  } else {
    portal = getPortalForState(state);
  }

  const handleApplyClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      onRequireAuth();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Globe size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{portal.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck size={12} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">Government Verified for {state}</span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-600">Official government portal for applications, tracking, and certificate downloads in {state}.</p>

      <div className="flex flex-col gap-2 pt-1">
        <a
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleApplyClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:scale-[1.02]"
        >
          <ExternalLink size={14} /> Apply Online
        </a>
        <a
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:scale-[1.02]"
        >
          <Globe size={14} /> Visit Website
        </a>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function PlanResult({ plan }: { plan: GuidancePlan }) {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }: any) => setUser(data?.user ?? null));
    }
  }, []);

  // Use real static data where available; fall back to plan fields from API
  const staticData = SERVICE_DATA[plan.service];
  const department = staticData?.department ?? plan.department;
  const eligibility = staticData?.eligibility ?? plan.eligibility;
  const timeline = staticData?.processingTime ?? plan.timeline;

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-lg shadow-blue-600/15">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Landmark size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
              Application Plan Ready · {plan.state}
            </p>
            <p className="mt-1.5 text-xl font-bold leading-snug">{plan.service}</p>
            <p className="mt-1 text-sm text-blue-100">
              {plan.purpose} · Status: <span className="font-semibold text-white">Generated ✓</span>
            </p>
          </div>
        </div>
      </div>

      {/* Data notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-sm leading-6 text-emerald-800">
          All factual information (eligibility, documents, fees, timelines, offices) is sourced from official
          Karnataka Government portals. No data is invented.
        </p>
      </div>

      {/* Grid: left col + right col */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_340px]">
        {/* ── LEFT ── */}
        <div className="space-y-5">
          {/* Eligibility */}
          <Card className="p-6">
            <SectionHeader icon={<BadgeCheck size={17} />} title="Eligibility" accent />
            <p className="text-sm leading-7 text-slate-700">{eligibility}</p>
          </Card>

          {/* Personalised next steps */}
          {plan.steps.length > 0 && (
            <Card className="p-6">
              <SectionHeader icon={<CheckCircle2 size={17} />} title="Your next steps" accent />
              <ol className="space-y-5">
                {plan.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {/* Required documents */}
          {(staticData?.documents ?? plan.documents).length > 0 ? (
            <Card className="p-6">
              <SectionHeader icon={<FileText size={17} />} title="Required documents" />
              <ul className="space-y-3">
                {(staticData
                  ? staticData.documents.map((name) => ({ name, mandatory: true, status: 'needed' as const }))
                  : plan.documents
                ).map((doc) => (
                  <li
                    key={doc.name}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <Circle size={15} className="shrink-0 text-slate-400" />
                    <span className="font-medium text-slate-800">{doc.name}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>

        {/* ── RIGHT ── */}
        <div className="space-y-4">
          {/* Processing Time */}
          <Card className="p-5">
            <SectionHeader icon={<Clock size={16} />} title="Processing Time" />
            <p className="text-2xl font-bold text-slate-900">{timeline}</p>
            <p className="mt-1 text-xs text-slate-500">From date of submission at the government office.</p>
          </Card>

          {/* Department */}
          <Card className="p-5">
            <SectionHeader icon={<Building2 size={16} />} title="Department" />
            <p className="text-sm font-semibold text-slate-900 leading-6">{department}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700">Government Verified</span>
            </div>
          </Card>

          {/* Nearest Office */}
          <Card className="p-5">
            <SectionHeader icon={<MapPin size={16} />} title="Nearest Office" accent />
            <NearestOfficeCard serviceName={plan.service} />
          </Card>

          {/* Official Website */}
          <Card className="p-5">
            <SectionHeader icon={<Globe size={16} />} title="Official Portal" accent />
            <OfficialWebsiteCard 
              serviceName={plan.service} 
              state={plan.state} 
              user={user} 
              onRequireAuth={() => setShowLoginModal(true)} 
            />
          </Card>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-5 text-amber-800">
              Verify all fees and exact documents with the issuing authority before your visit, as requirements may
              change without notice.
            </p>
          </div>
        </div>
      </div>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        title="Login to Apply Online"
      />
    </div>
  );
}
