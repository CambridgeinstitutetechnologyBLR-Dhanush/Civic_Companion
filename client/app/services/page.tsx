import { ArrowRight, LogOut, Sparkles, Wallet, BadgeCheck, Baby, FileWarning, CarFront, Plane, CreditCard, Vote, Fingerprint, ShoppingBasket, FileText } from 'lucide-react';
import { fetchGovernmentServices } from '../../lib/services';
import { Button, ButtonLink, CardLink, Eyebrow, Navbar, SectionTitle, Shell } from './_components/ui';

const serviceIcons: Record<string, React.ElementType> = {
  'Income Certificate': Wallet,
  'Caste Certificate': BadgeCheck,
  'Birth Certificate': Baby,
  'Death Certificate': FileWarning,
  'Driving License': CarFront,
  'Passport': Plane, // Plane matches the user request description though the snippet said Passport
  'Voter ID': Vote,
  'PAN Card': CreditCard,
  'Aadhaar Update': Fingerprint,
  'Ration Card': ShoppingBasket,
};

export default async function ServicesPage() {
  const governmentServices = await fetchGovernmentServices();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_36%,#f7f9fc_100%)] text-slate-900">
      <Navbar rightSlot={<form action="/auth/signout" method="post"><Button variant="ghost" type="submit" className="gap-2 text-slate-600"><LogOut size={16} /> Sign out</Button></form>} />

      <Shell>
        <section className="grid items-center gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm shadow-slate-900/5 backdrop-blur sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.9fr)]">
          <div className="space-y-6">
            <Eyebrow>
              <Sparkles size={13} /> AI government service planner
            </Eyebrow>
            <SectionTitle
              title={<>What do you need help with?</>}
              description={
                <>Choose a service and get a guided planning flow that explains the right documents, questions, and next steps before you apply.</>
              }
            />
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="#services">Browse services <ArrowRight size={16} /></ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary">Go to dashboard</ButtonLink>
            </div>
          </div>

          <CardLink href="/services/income-certificate" className="p-6 transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] transition-transform duration-200 ease-out group-hover:scale-105">
                  <Wallet size={34} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">AI guidance</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">How it works</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">Pick a service, answer a few questions, and save a ready-to-use application plan to your dashboard.</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">Personalized guidance</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">Saved in Supabase</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">Returns to your dashboard</span>
              </div>
            </div>
          </CardLink>
        </section>

        <section id="services" className="mt-10 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>
                <Sparkles size={13} /> popular services
              </Eyebrow>
              <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-slate-900 sm:text-4xl">Choose a service to start planning.</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">Each card opens a guided planner that keeps the workflow simple and saves your progress to the dashboard.</p>
            </div>
            <ButtonLink href="/dashboard" variant="ghost">Dashboard <ArrowRight size={16} /></ButtonLink>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {governmentServices.map((service) => {
              const slug = service.slug ?? service.id ?? '';
              const Icon = serviceIcons[service.name] || FileText;
              return (
              <CardLink key={slug} href={`/services/${slug}`} className="group p-6 transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-md">
              <div className="flex h-full items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] transition-transform duration-200 ease-out group-hover:scale-105">
                  <Icon size={34} className="text-[#2563EB]" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">{service.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all group-hover:bg-[#2563EB]">
                    Get guidance <ArrowRight size={15} />
                  </span>
                </div>
              </div>
              </CardLink>
            )})}
          </div>
        </section>
      </Shell>
    </main>
  );
}
