'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, LoaderCircle, MessageSquareText, Sparkles, XCircle } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';
import { findService } from '../../../lib/services';
import {
  Button,
  ButtonLink,
  Card,
  Eyebrow,
  Field,
  InputField,
  Navbar,
  ProgressStepper,
  SectionTitle,
  SelectField,
  Shell,
} from '../_components/ui';
import { type GuidancePlan, PlanResult } from '../_components/PlanResult';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

const questions = [
  'Which state do you live in?',
  'Which district do you live in?',
  'Which taluk do you live in? (Optional)',
  'What is your native place/village? (Optional)',
  'What is the purpose of your application?',
  'Which category best describes you?',
];

export default function ServicePlannerPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [service, setService] = useState<Awaited<ReturnType<typeof findService>>>(undefined);
  const [step, setStep] = useState(0);
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [nativePlace, setNativePlace] = useState('');
  const [purpose, setPurpose] = useState('Education / scholarship');
  const [category, setCategory] = useState('Student');

  // Plan generation state
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<GuidancePlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    findService(slug).then((result) => {
      if (active) setService(result);
    });
    return () => { active = false; };
  }, [slug]);

  if (!service) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_36%,#f7f9fc_100%)] text-slate-900">
        <Navbar backHref="/services" />
        <Shell className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <Card className="w-full max-w-xl p-8 text-center">
            <Eyebrow>
              <Sparkles size={13} /> service not found
            </Eyebrow>
            <h1 className="mt-5 font-serif text-3xl tracking-[-0.04em] text-slate-900">
              We could not find that service.
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Please choose one of the available services and continue from there.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/services">View services</ButtonLink>
            </div>
          </Card>
        </Shell>
      </main>
    );
  }

  // ── Final step: call API ────────────────────────────────────────────────────
  const generatePlan = async () => {
    setGenerating(true);
    setError('');

    // Ensure user is authenticated so we can attach a user_id later if needed
    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.assign('/login?error=unauthorized');
        return;
      }
    }

    // Try to get GPS coordinates
    let lat: number | undefined;
    let lng: number | undefined;
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }
    } catch (err) {
      console.warn("GPS unavailable or denied:", err);
    }

    try {
      const response = await fetch(`${API_BASE}/api/plans/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: service.name,
          state,
          purpose,
          has_aadhaar: true,
          category,
          district: district || undefined,
          taluk: taluk || undefined,
          native_place: nativePlace || undefined,
          latitude: lat,
          longitude: lng
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error((detail as { detail?: string }).detail ?? `HTTP ${response.status}`);
      }

      const data = (await response.json()) as GuidancePlan;
      setPlan(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not generate your plan. Please try again.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const continuePlan = async (event: FormEvent) => {
    event.preventDefault();
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    await generatePlan();
  };

  // ── Save generated plan and go to dashboard ─────────────────────────────────
  const savePlan = async () => {
    if (!plan || saving) return;
    setSaving(true);
    setToast(null);

    try {
      // 1. Get the currently authenticated user
      const supabase = createClient();
      let userId: string | null = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.assign('/login?error=unauthorized');
          return;
        }
        userId = user.id;
      }

      // 2. PATCH the application row — write user_id and status='saved'
      const patchRes = await fetch(
        `${API_BASE}/api/applications/${plan.application_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'saved', user_id: userId }),
        },
      );

      if (!patchRes.ok) {
        const detail = await patchRes.json().catch(() => ({}));
        throw new Error(
          (detail as { detail?: string }).detail ?? `Save failed (HTTP ${patchRes.status})`,
        );
      }

      // 3. Mark as saved, show success toast, then navigate
      setSaved(true);
      setToast({ type: 'success', message: 'Plan saved! Taking you to your dashboard…' });
      // Small delay so the toast is visible for a moment
      await new Promise((r) => setTimeout(r, 800));
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Could not save your plan. Please try again.';
      setToast({ type: 'error', message: msg });
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_30%,#f7f9fc_100%)] text-slate-900">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-xl transition-all ${toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white'
            }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}
      <Navbar
        backHref="/services"
        backLabel="All services"
        rightSlot={<ButtonLink href="/dashboard" variant="ghost">Dashboard</ButtonLink>}
      />

      <Shell>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <Eyebrow>
              <Sparkles size={13} /> AI service planner
            </Eyebrow>
            <SectionTitle
              className="mx-auto mt-5"
              title={<>{service.name}</>}
              description={
                plan
                  ? <>Your personalised application plan is ready.</>
                  : <>We&apos;ll use a few details to prepare your application plan.</>
              }
            />
          </div>

          {/* ── Wizard ── */}
          {!plan ? (
            <Card className="overflow-hidden p-0 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5 sm:px-8">
                <ProgressStepper steps={questions} currentStep={step} />
              </div>

              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_320px]">
                <div className="space-y-6 p-6 sm:p-8">
                  {/* AI question bubble */}
                  <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                        <MessageSquareText size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                          Civic Companion AI
                        </p>
                        <p className="mt-2 text-base leading-7 text-slate-700">
                          {questions[step]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={continuePlan} className="space-y-5">
                    <Field label="Your answer">
                      <div className="space-y-4">
                        {step === 0 ? (
                          <SelectField value={state} onChange={(e) => setState(e.target.value)}>
                            <option>Karnataka</option>
                            <option>Maharashtra</option>
                            <option>Tamil Nadu</option>
                            <option>Delhi</option>
                          </SelectField>
                        ) : step === 1 ? (
                          <InputField
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="e.g. Bengaluru Urban"
                            required
                          />
                        ) : step === 2 ? (
                          <InputField
                            value={taluk}
                            onChange={(e) => setTaluk(e.target.value)}
                            placeholder="e.g. Bengaluru South"
                          />
                        ) : step === 3 ? (
                          <InputField
                            value={nativePlace}
                            onChange={(e) => setNativePlace(e.target.value)}
                            placeholder="e.g. Jayanagar"
                          />
                        ) : step === 4 ? (
                          <SelectField value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                            <option>Education / scholarship</option>
                            <option>Job application</option>
                            <option>Government scheme</option>
                            <option>Personal record</option>
                            <option>Other purpose</option>
                          </SelectField>
                        ) : (
                          <SelectField value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option>Student</option>
                            <option>Employee</option>
                            <option>Farmer</option>
                            <option>Senior citizen</option>
                            <option>Job seeker</option>
                            <option>Small business owner</option>
                            <option>Other</option>
                          </SelectField>
                        )}
                      </div>
                    </Field>

                    {step === 5 ? (
                      <Card className="border-blue-100 bg-blue-50/60 p-5 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                          Plan summary
                        </p>
                        <p className="truncate font-medium">
                          {state} · {district || 'Your district'} · {taluk || 'Your taluk'} · {purpose}
                        </p>
                        <p className="mt-3 text-sm text-blue-800">
                          Allow Civic Companion to access your location to find the nearest government office.
                        </p>
                      </Card>
                    ) : null}

                    {error ? (
                      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                      </p>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="submit"
                        className="sm:min-w-[220px]"
                        disabled={generating}
                      >
                        {generating ? (
                          <LoaderCircle className="animate-spin" size={17} />
                        ) : null}
                        {generating
                          ? 'Generating your plan…'
                          : step === 5
                            ? 'Generate my plan'
                            : 'Continue'}
                        {!generating ? <ArrowRight size={17} /> : null}
                      </Button>
                      <ButtonLink href="/services" variant="secondary">
                        Back to services
                      </ButtonLink>
                    </div>
                  </form>
                </div>

                {/* Sidebar */}
                <aside className="border-t border-slate-200 bg-slate-50/70 p-6 lg:border-l lg:border-t-0 lg:p-8">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      What you get
                    </p>
                    <Card className="p-5">
                      <p className="text-sm font-semibold text-slate-900">
                        Your personalised plan will include
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                        <li>• Eligibility criteria from verified records</li>
                        <li>• Required documents checklist</li>
                        <li>• Exact fee from official data</li>
                        <li>• Nearest office details</li>
                        <li>• Personalised next steps</li>
                        <li>• Saved to your dashboard</li>
                      </ul>
                    </Card>

                    <Card className="p-5">
                      <p className="text-sm font-semibold text-slate-900">Current inputs</p>
                      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        {[
                          ['State', state],
                          ['District', district || 'Not entered yet'],
                          ['Taluk', taluk || 'Not entered yet'],
                          ['Native Place', nativePlace || 'Not entered yet'],
                          ['Purpose', purpose],
                          ['Category', category],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between gap-4">
                            <span className="font-medium text-slate-500">{label}</span>
                            <span className="text-right text-slate-900">{value}</span>
                          </div>
                        ))}
                      </dl>
                    </Card>
                  </div>
                </aside>
              </div>
            </Card>
          ) : (
            /* ── Plan Result ── */
            <div className="space-y-5">
              <PlanResult plan={plan} />

              {/* CTA */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={savePlan}
                  disabled={saving || saved}
                  className="sm:min-w-[240px]"
                >
                  {saving ? (
                    <LoaderCircle className="animate-spin" size={17} />
                  ) : saved ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                  {saving ? 'Saving…' : saved ? 'Redirecting…' : 'Save plan & go to dashboard'}
                </Button>
                <ButtonLink href="/services" variant="secondary">
                  Plan another service
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Shell>
    </main>
  );
}
