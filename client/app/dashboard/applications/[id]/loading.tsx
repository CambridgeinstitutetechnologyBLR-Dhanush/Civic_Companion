import { Landmark, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Landmark size={18} />
          </span>
          <span className="text-lg">CivicCompanion</span>
        </div>
      </header>
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
        </div>
        
        {/* Header Skeleton */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200"></div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
              </div>
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200"></div>
              <div className="flex gap-6">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200"></div>
              <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200"></div>
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"></div>
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"></div>
          </div>
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"></div>
            <div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
