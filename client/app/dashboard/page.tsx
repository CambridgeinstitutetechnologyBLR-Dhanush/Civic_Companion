import { redirect } from 'next/navigation';
import { LogOut, Landmark } from 'lucide-react';
import { createClient } from '../../lib/supabase/server';
import DashboardClient from './_components/DashboardClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/login?error=supabase_not_configured');

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect('/login?error=unauthorized');

  const { data: applications } = await supabase.from('applications')
    .select('id, service, state, purpose, status, created_at')
    .order('created_at', { ascending: false });

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

      <DashboardClient user={data.user} initialApplications={applications || []} />
    </main>
  );
}
