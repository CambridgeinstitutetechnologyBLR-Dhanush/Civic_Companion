"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, FileText, Clock3, BadgeCheck, XCircle, 
  MapPin, Building2, Bell, History, Download, Headset, UserCog, Plus
} from 'lucide-react';
import { Button } from '../../services/_components/ui';
import { formatDate } from '../../../lib/utils';

// Mock data for nearest offices fallback
const OFFICES = [
  { name: 'Bangalore One Center', type: 'Citizen Services', lat: 12.9716, lng: 77.5946, address: 'MG Road, Bengaluru', hours: '10 AM - 6 PM', phone: '080-22223333' },
  { name: 'Nadakacheri Rajajinagar', type: 'Revenue Department', lat: 13.0039, lng: 77.5543, address: 'Rajajinagar, Bengaluru', hours: '10 AM - 5:30 PM', phone: '080-12345678' },
  { name: 'Seva Sindhu Center Mysuru', type: 'Citizen Services', lat: 12.2958, lng: 76.6394, address: 'Saraswathipuram, Mysuru', hours: '10 AM - 5:30 PM', phone: '0821-234567' },
  { name: 'Aadhaar Seva Kendra Hubballi', type: 'UIDAI', lat: 15.3647, lng: 75.1240, address: 'Vidya Nagar, Hubballi', hours: '9 AM - 5 PM', phone: '0836-222333' },
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const APPLY_URLS: Record<string, string> = {
  'Income Certificate': 'https://sevasindhuservices.karnataka.gov.in/',
  'Caste Certificate': 'https://sevasindhuservices.karnataka.gov.in/',
  'Birth Certificate': 'https://crsorgi.gov.in/',
  'Death Certificate': 'https://crsorgi.gov.in/',
  'Driving License': 'https://parivahan.gov.in/',
  'Passport': 'https://www.passportindia.gov.in/',
  'Voter ID': 'https://voters.eci.gov.in/',
  'PAN Card': 'https://www.protean-tinpan.com/',
  'Aadhaar Update': 'https://myaadhaar.uidai.gov.in/',
  'Ration Card': 'https://ahara.karnataka.gov.in/',
};

export default function DashboardClient({ user, initialApplications }: { user: any, initialApplications: any[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearestOffice, setNearestOffice] = useState<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        let nearestCandidate = OFFICES[0];
        let minDistance = Infinity;
        
        OFFICES.forEach(office => {
          const dist = getDistance(latitude, longitude, office.lat, office.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCandidate = office;
          }
        });
        setNearestOffice({ ...nearestCandidate, distance: minDistance.toFixed(1) });
      });
    }
  }, []);

  const total = initialApplications.length;
  const pending = initialApplications.filter(a => a.status === 'pending').length;
  const approved = initialApplications.filter(a => a.status === 'approved').length;
  const rejected = initialApplications.filter(a => a.status === 'rejected').length;

  const filteredApps = initialApplications.filter(app => {
    const matchesSearch = app.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, Dhanush 👋</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-1 text-xs text-slate-400">Last Login: Today • 10:45 AM</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-64">
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>Profile Completion</span>
            <span>85%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-blue-600 w-[85%] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Applications', count: total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', count: pending, icon: Clock3, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Approved', count: approved, icon: BadgeCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', count: rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map(stat => (
          <div key={stat.label} className="group flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${stat.bg} transition-transform group-hover:scale-105`}>
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        {/* Main Content Area */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">Your Applications</h2>
              <span 
                title="This dashboard contains sample application data used for demonstration."
                className="cursor-help inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors hover:bg-blue-100"
              >
                🧪 Demo Mode
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search applications..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 py-2 pl-3 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps.length > 0 ? filteredApps.map(app => (
              <div key={app.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{app.service}</h3>
                    <p className="mt-1 text-sm text-slate-500">{app.purpose || 'General Purpose'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{formatDate(app.created_at)}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-orange-100 text-orange-800'}
                    `}>
                      {app.status === 'approved' ? '🟢 Approved' : app.status === 'rejected' ? '🔴 Rejected' : '🟡 Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/applications/${app.id}`}>
                      <Button variant="secondary" className="text-xs h-8">View Details</Button>
                    </Link>
                    {APPLY_URLS[app.service] && (
                      <button 
                        onClick={() => window.open(APPLY_URLS[app.service], '_blank')}
                        className="inline-flex h-8 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Apply Online
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No recent applications</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm">Apply for your first Government Service to see it tracked here securely.</p>
                <Link href="/services" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-transform hover:scale-105">
                  <Plus size={16} /> Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar turned into Bottom Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nearest Office */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              <MapPin size={16} /> Nearest Office
            </h3>
            {nearestOffice ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900">{nearestOffice.name}</h4>
                  <span className="inline-block mt-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {nearestOffice.distance} km away
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><Building2 size={14} className="text-slate-400" /> {nearestOffice.address}</p>
                  <p className="flex items-center gap-2"><Clock3 size={14} className="text-green-500" /> Open • {nearestOffice.hours}</p>
                  <p className="flex items-center gap-2"><Headset size={14} className="text-slate-400" /> {nearestOffice.phone}</p>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${nearestOffice.lat},${nearestOffice.lng}`, '_blank')}
                  className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:scale-[1.02]"
                >
                  Get Directions
                </button>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                <div className="h-10 w-full rounded-lg bg-slate-100"></div>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/services" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-center transition-all hover:bg-blue-50 hover:text-blue-700">
                <Plus size={20} className="text-slate-600 group-hover:text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">New App</span>
              </Link>
              <Link href="/dashboard/downloads" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-center transition-all hover:bg-blue-50 hover:text-blue-700 group">
                <Download size={20} className="text-slate-600 group-hover:text-blue-600" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">Downloads</span>
              </Link>
              <Link href="/support" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-center transition-all hover:bg-blue-50 hover:text-blue-700 group">
                <Headset size={20} className="text-slate-600 group-hover:text-blue-600" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">Support</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 p-4 text-center transition-all hover:bg-blue-50 hover:text-blue-700 group">
                <UserCog size={20} className="text-slate-600 group-hover:text-blue-600" />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">Profile</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
