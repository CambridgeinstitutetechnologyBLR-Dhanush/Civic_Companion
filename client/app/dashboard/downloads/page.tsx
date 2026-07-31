'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, FileText, Filter, Landmark, Receipt, Search, Shield } from 'lucide-react';

const MOCK_DOCS = [
  { id: '1', name: 'Income Certificate', type: 'Certificate', date: '28 Jul 2026', category: 'certificate', status: 'Available' },
  { id: '2', name: 'Application Receipt – Caste Certificate', type: 'Receipt', date: '25 Jul 2026', category: 'receipt', status: 'Available' },
  { id: '3', name: 'Acknowledgement Slip – Income Certificate', type: 'Acknowledgement', date: '28 Jul 2026', category: 'acknowledgement', status: 'Available' },
];

const CATEGORIES = ['All', 'Certificates', 'Receipts', 'Acknowledgements'];

export default function DownloadsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = MOCK_DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.type.toLowerCase().startsWith(category.toLowerCase().slice(0, -1));
    return matchSearch && matchCat;
  });

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navbar */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16, color: '#0F172A' }}>
          <span style={{ background: '#2563EB', color: '#fff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={16} /></span>
          CivicCompanion
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Downloads</h1>
          <p style={{ color: '#64748B', fontSize: 15, margin: 0 }}>Your downloaded certificates, receipts, and acknowledgement slips.</p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #E2E8F0', paddingLeft: 42, paddingRight: 16, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: '10px 18px', borderRadius: 10, border: '1.5px solid', borderColor: category === c ? '#2563EB' : '#E2E8F0', background: category === c ? '#EEF4FF' : '#fff', color: category === c ? '#2563EB' : '#64748B', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Doc list */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {doc.category === 'certificate' ? <Shield size={22} color="#2563EB" /> : doc.category === 'receipt' ? <Receipt size={22} color="#2563EB" /> : <FileText size={22} color="#2563EB" />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{doc.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>{doc.type} · Issued {doc.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    <Eye size={15} /> Preview
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    <Download size={15} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 20, border: '2px dashed #E2E8F0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Download size={28} color="#2563EB" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>No downloadable documents available</h3>
            <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px' }}>Documents appear here after your applications are approved.</p>
            <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Apply for a Service
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
