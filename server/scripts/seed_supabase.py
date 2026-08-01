"""Seed Supabase with verified Karnataka records for income and caste certificates.

Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python seed_supabase.py
"""
import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client as create_supabase_client

load_dotenv()


SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables')

supabase = create_supabase_client(SUPABASE_URL, SUPABASE_KEY)

now = datetime.utcnow().isoformat()

def upsert(table, rows):
    for r in rows:
        try:
            supabase.table(table).upsert(r).execute()
            print('Upserted into', table, r.get('id'))
        except Exception as exc:
            raise SystemExit(f'Error inserting into {table}: {exc}')


def main():
    # service_rules for Karnataka
    rules = [
        {
            'id': 'income-karnataka',
            'service': 'Income Certificate',
            'state': 'Karnataka',
            'eligibility': 'Resident of Karnataka requiring income proof for schemes and scholarships',
            'fee': 'Rs.25',
            'processing_time': '21 working days',
            'department': 'REVENUE DEPARTMENT',
            'official_url': 'https://nadakacheri.karnataka.gov.in',
        },
        {
            'id': 'caste-karnataka',
            'service': 'Caste Certificate',
            'state': 'Karnataka',
            'eligibility': 'Residents claiming community reservation benefits',
            'fee': 'Rs.25',
            'processing_time': '21 working days',
            'department': 'REVENUE DEPARTMENT',
            'official_url': 'https://nadakacheri.karnataka.gov.in',
        },
    ]

    docs = [
        {'id': 'income-doc-aadhaar', 'service': 'Income Certificate', 'state': 'Karnataka', 'document_name': 'Aadhaar card', 'mandatory': True},
        {'id': 'income-doc-address', 'service': 'Income Certificate', 'state': 'Karnataka', 'document_name': 'Address proof', 'mandatory': True},
        {'id': 'caste-doc-aadhaar', 'service': 'Caste Certificate', 'state': 'Karnataka', 'document_name': 'Aadhaar card', 'mandatory': True},
        {'id': 'caste-doc-address', 'service': 'Caste Certificate', 'state': 'Karnataka', 'document_name': 'Address proof', 'mandatory': True},
    ]

    offices = [
        {
            'id': 'ajsk-karnataka-1',
            'state': 'Karnataka',
            'district': 'Bengaluru Urban',
            'office_name': 'Atalji Janasnehi Directorate',
            'address': 'Atalji Janasnehi Directorate, SSLR Building, K R Circle, Bangalore-560001',
            'official_url': 'https://nadakacheri.karnataka.gov.in/AJSK/Home/Contact',
        },
    ]

    sources = [
        {'id': 'src-income-nadakacheri', 'service': 'Income Certificate', 'source_name': 'Nadakacheri AJSK home', 'source_url': 'https://nadakacheri.karnataka.gov.in', 'last_reviewed': now},
        {'id': 'src-income-contact', 'service': 'Income Certificate', 'source_name': 'Nadakacheri contact page', 'source_url': 'https://nadakacheri.karnataka.gov.in/AJSK/Home/Contact', 'last_reviewed': now},
        {'id': 'src-caste-nadakacheri', 'service': 'Caste Certificate', 'source_name': 'Nadakacheri AJSK home', 'source_url': 'https://nadakacheri.karnataka.gov.in', 'last_reviewed': now},
        {'id': 'src-caste-contact', 'service': 'Caste Certificate', 'source_name': 'Nadakacheri contact page', 'source_url': 'https://nadakacheri.karnataka.gov.in/AJSK/Home/Contact', 'last_reviewed': now},
    ]

    upsert('service_rules', rules)
    upsert('service_documents', docs)
    upsert('service_offices', offices)
    upsert('source_records', sources)


if __name__ == '__main__':
    main()
