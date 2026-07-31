import { redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import ApplicationDetailsClient from './_components/ApplicationDetailsClient';
import Link from 'next/link';
import { ArrowLeft, Landmark, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  if (!supabase) redirect('/login?error=supabase_not_configured');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login?error=unauthorized');

  const { data: application, error } = await supabase.from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !application) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
          <Link className="flex items-center gap-2 font-bold text-slate-900" href="/dashboard">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Landmark size={18} />
            </span>
            <span className="text-lg">CivicCompanion</span>
          </Link>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Application not found</h2>
          <p className="mt-2 text-slate-500">The application you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
        <Link className="flex items-center gap-2 font-bold text-slate-900" href="/dashboard">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Landmark size={18} />
          </span>
          <span className="text-lg">CivicCompanion</span>
        </Link>
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </header>

      <ApplicationDetailsClient application={application} user={user} />
    </main>
  );
}
