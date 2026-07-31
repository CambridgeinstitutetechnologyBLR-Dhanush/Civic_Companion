'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, CheckCircle2, Clock3, AlertCircle, 
  MapPin, Globe, ExternalLink, ShieldCheck, Phone, Download,
  MessageCircle, Send, Plus
} from 'lucide-react';
import { getIncomePortal, getCastePortal, getPortalForState } from '../../../../../lib/stateData';
import { formatDate } from '../../../../../lib/utils';

// Generate mock timeline based on created_at and status
function generateTimeline(app: any) {
  const created = new Date(app.created_at);
  const timeline = [
    { date: formatDate(created), status: 'Application Submitted', completed: true }
  ];
  
  if (app.status === 'approved') {
    timeline.push({ date: formatDate(created.getTime() + 86400000), status: 'Verification Started', completed: true });
    timeline.push({ date: formatDate(created.getTime() + 172800000), status: 'Revenue Officer Assigned', completed: true });
    timeline.push({ date: formatDate(created.getTime() + 259200000), status: 'Approved', completed: true });
    timeline.push({ date: formatDate(created.getTime() + 259200000), status: 'Certificate Generated', completed: true });
  } else if (app.status === 'rejected') {
    timeline.push({ date: formatDate(created.getTime() + 86400000), status: 'Verification Started', completed: true });
    timeline.push({ date: formatDate(created.getTime() + 172800000), status: 'Rejected', completed: true });
  } else {
    timeline.push({ date: formatDate(created.getTime() + 86400000), status: 'Verification Started', completed: true });
    timeline.push({ date: formatDate(created.getTime() + 172800000), status: 'Revenue Officer Assigned', completed: false });
    timeline.push({ date: 'Pending', status: 'Pending Approval', completed: false });
  }
  return timeline;
}

export default function ApplicationDetailsClient({ application, user }: { application: any, user: any }) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: `Hi ${user.user_metadata?.full_name || 'there'}! I'm your Civic Assistant. You can ask me any questions about your ${application.service} application (ID: ${application.id.substring(0,8).toUpperCase()}).` }
  ]);

  const timeline = generateTimeline(application);
  const currentStep = timeline.filter(t => t.completed).length;

  let portal;
  if (application.service.toLowerCase().includes('income')) {
    portal = getIncomePortal(application.state);
  } else if (application.service.toLowerCase().includes('caste')) {
    portal = getCastePortal(application.state);
  } else {
    portal = getPortalForState(application.state);
  }

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { role: 'user', text: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Based on your application status (${application.status}), the typical processing time is 7-14 working days. Since you applied on ${formatDate(application.created_at)}, you should receive an update soon. Would you like me to guide you on how to check the official portal?` 
      }]);
    }, 1000);
    setChatInput('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header Card */}
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider
                ${application.status === 'approved' ? 'bg-green-100 text-green-700' : 
                  application.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                  'bg-orange-100 text-orange-700'}
              `}>
                {application.status === 'approved' ? '🟢 Approved' : application.status === 'rejected' ? '🔴 Rejected' : '🟡 Pending'}
              </span>
              <span className="text-sm font-mono font-medium text-slate-500">
                APP-{application.id.substring(0,8).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{application.service}</h1>
            
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Submitted Date</p>
                <p className="font-semibold text-slate-700">{formatDate(application.created_at)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Department</p>
                <p className="font-semibold text-slate-700">{application.department || 'Revenue Department'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Purpose</p>
                <p className="font-semibold text-slate-700">{application.purpose || 'General'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">State</p>
                <p className="font-semibold text-slate-700">{application.state}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Applicant</p>
                <p className="font-semibold text-slate-700">{user.user_metadata?.full_name || user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            {application.status === 'approved' ? (
              <>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  <Download size={18} /> Download Certificate
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50">
                  Preview Document
                </button>
              </>
            ) : application.status === 'rejected' ? (
              <>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-red-700">
                  View Rejection Reason
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50">
                  Apply Again
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => window.open(portal?.url, '_blank')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  <ExternalLink size={18} /> Sample Application
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50">
                  Contact Department
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Progress Tracker */}
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Application Progress</h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-100 sm:left-10 sm:top-6 sm:bottom-auto sm:right-10 sm:w-auto sm:h-0.5" />
              
              <div className="flex flex-col gap-8 sm:flex-row sm:justify-between relative z-10">
                {['Submitted', 'Under Verification', 'Officer Review', 'Approved'].map((step, idx) => {
                  const isActive = idx < currentStep;
                  const isCurrent = idx === currentStep - 1 && application.status === 'pending';
                  
                  return (
                    <div key={step} className="flex flex-row sm:flex-col items-center gap-4 sm:w-1/4">
                      <div className={`flex h-12 w-12 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full border-4 ring-4 ring-white transition-colors duration-500
                        ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-300'}
                        ${isCurrent ? 'shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' : ''}
                      `}>
                        {isActive ? <CheckCircle2 size={24} className="sm:h-8 sm:w-8" /> : <Clock3 size={24} className="sm:h-8 sm:w-8" />}
                      </div>
                      <div className="text-left sm:text-center mt-0 sm:mt-2">
                        <p className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                          {isActive ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Uploaded Documents */}
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Required Documents</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {['Aadhaar Card', 'Address Proof', 'Passport Photo', 'Income Proof'].map((doc) => (
                <div key={doc} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc}</p>
                      <p className="text-xs font-medium text-slate-500">Verified</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Preview</button>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Timeline</h3>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2
                    ${item.completed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}
                  `}>
                    {item.completed ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                  </div>
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className={`font-bold ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>{item.status}</div>
                      <time className="font-mono text-xs text-slate-400">{item.date}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* AI Assistant Chat */}
          <section className="flex flex-col h-[500px] rounded-3xl bg-slate-900 text-white shadow-xl overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Ask AI Assistant</h3>
                  <p className="text-xs text-slate-400">Context-aware help for this application</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900">
              <div className="flex items-start gap-2 mb-3 rounded-xl bg-amber-900/20 p-2.5 text-xs text-amber-200/90 border border-amber-900/30">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>⚠️ Responses are based on publicly available government information and demonstration data. Always verify critical information on the official government website.</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => setChatInput("Why is my application pending?")} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors">Why is it pending?</button>
                <button onClick={() => setChatInput("How long will approval take?")} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors">How long will it take?</button>
              </div>
              <form onSubmit={handleChat} className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-3 pl-4 pr-12 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-50">
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </section>

          {/* Official Website */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Official Portal</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                <Globe size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{portal?.name}</p>
                <p className="flex items-center gap-1 text-xs font-semibold text-green-600 mt-0.5">
                  <ShieldCheck size={14} /> Govt Verified
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={portal?.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                <ExternalLink size={16} /> Track Online
              </a>
              <a href={portal?.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                <Globe size={16} /> Visit Official Website
              </a>
            </div>
          </section>

          {/* Department Information */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Department Info</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900">Revenue Department</h4>
                <p className="text-sm text-slate-500 mt-1">Nadakacheri Office</p>
              </div>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <p>123 Government Complex, MG Road, {application.state}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-slate-400" />
                  <p>1800-123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 size={16} className="shrink-0 text-slate-400" />
                  <p>Mon - Fri: 10:00 AM - 5:30 PM</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Demo Information Footer */}
      <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <span className="text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Demo Information</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Application status and progress displayed here are representative examples for demonstration purposes. 
              To view the official status, use the "Track Online" option on the respective government portal.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
