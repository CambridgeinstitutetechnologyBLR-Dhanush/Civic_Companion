// lib/serviceData.ts
// Authoritative, static data for each government service.
// Used in PlanResult to render real department, portal, and office info.

export type ServicePortal = {
  name: string;
  url: string;
  description: string;
};

export type ServiceOfficeType = {
  name: string;
  searchKeyword: string; // used for Google Maps Places search fallback
};

export type ServiceData = {
  department: string;
  officeType: ServiceOfficeType;
  portal: ServicePortal;
  documents: string[];
  processingTime: string;
  eligibility: string;
};

export const SERVICE_DATA: Record<string, ServiceData> = {
  'Income Certificate': {
    department: 'Revenue Department, Government of Karnataka',
    officeType: {
      name: 'Nadakacheri / Taluk Office',
      searchKeyword: 'Nadakacheri Karnataka',
    },
    portal: {
      name: 'Seva Sindhu',
      url: 'https://sevasindhuservices.karnataka.gov.in/',
      description: 'Official Karnataka citizen services portal for applying online.',
    },
    documents: ['Aadhaar Card', 'Address Proof', 'Ration Card', 'Passport Size Photo', 'Self-Declaration'],
    processingTime: '7–15 working days',
    eligibility: 'Karnataka residents with annual family income below ₹8 lakh. Applicable for scholarships, job reservations, and government scheme benefits.',
  },
  'Caste Certificate': {
    department: 'Revenue Department, Government of Karnataka',
    officeType: {
      name: 'Nadakacheri / Taluk Office',
      searchKeyword: 'Nadakacheri Karnataka',
    },
    portal: {
      name: 'Seva Sindhu',
      url: 'https://sevasindhuservices.karnataka.gov.in/',
      description: 'Official Karnataka citizen services portal for applying online.',
    },
    documents: ['Aadhaar Card', 'Address Proof', 'Birth Certificate / School Records', 'Caste Affidavit', 'Parent Caste Certificate (if available)'],
    processingTime: '15–30 working days',
    eligibility: 'Karnataka residents belonging to SC, ST, or OBC communities. Required for education, employment, and government scheme reservations.',
  },
  'Birth Certificate': {
    department: 'Registrar of Births & Deaths, Urban/Rural Local Bodies',
    officeType: {
      name: 'Municipal Office / Gram Panchayat',
      searchKeyword: 'Municipal office Bengaluru',
    },
    portal: {
      name: 'Civil Registration System',
      url: 'https://crsorgi.gov.in/',
      description: 'National Civil Registration portal for birth and death registration.',
    },
    documents: ['Hospital Discharge Summary', 'Parents Aadhaar', 'Marriage Certificate', 'Application Form'],
    processingTime: '7–10 working days',
    eligibility: 'Available for births registered in Karnataka. Events within 21 days can be registered without a fee.',
  },
  'Death Certificate': {
    department: 'Registrar of Births & Deaths, Urban/Rural Local Bodies',
    officeType: {
      name: 'Municipal Office / Gram Panchayat',
      searchKeyword: 'Municipal office Bengaluru',
    },
    portal: {
      name: 'Civil Registration System',
      url: 'https://crsorgi.gov.in/',
      description: 'National Civil Registration portal for birth and death registration.',
    },
    documents: ['Hospital Death Certificate', 'Aadhaar of Deceased', 'Applicant Aadhaar', 'Application Form'],
    processingTime: '7–10 working days',
    eligibility: 'Immediate family members or legal heirs of the deceased registered in Karnataka.',
  },
  'Driving License': {
    department: 'Transport Department, Government of Karnataka',
    officeType: {
      name: 'Regional Transport Office (RTO)',
      searchKeyword: 'RTO office Karnataka',
    },
    portal: {
      name: 'Parivahan Sewa',
      url: 'https://parivahan.gov.in/',
      description: 'Ministry of Road Transport & Highways national portal for driving licence services.',
    },
    documents: ['Aadhaar Card', 'Address Proof', 'Age Proof', 'Passport Size Photo', "Learner's Licence (for DL)"],
    processingTime: '30 days (after passing driving test)',
    eligibility: 'Indian citizens aged 16+ for two-wheelers (without gear) and 18+ for other vehicles. Medical fitness certificate required for heavy vehicles.',
  },
  'Passport': {
    department: 'Ministry of External Affairs, Government of India',
    officeType: {
      name: 'Passport Seva Kendra (PSK)',
      searchKeyword: 'Passport Seva Kendra Bengaluru',
    },
    portal: {
      name: 'Passport Seva',
      url: 'https://www.passportindia.gov.in/',
      description: 'Official Ministry of External Affairs portal for passport application and appointment booking.',
    },
    documents: ['Aadhaar Card', 'Birth Certificate or 10th Mark Sheet', 'Address Proof', 'Passport Size Photo', 'Police Clearance Certificate (if required)'],
    processingTime: '7 days (Tatkal) / 30–45 days (Normal)',
    eligibility: 'All Indian citizens. Applicants with criminal convictions or pending court proceedings may face restrictions.',
  },
  'Voter ID': {
    department: 'Election Commission of India',
    officeType: {
      name: 'Electoral Registration Office',
      searchKeyword: 'Electoral Registration Office Bengaluru',
    },
    portal: {
      name: "Voter's Service Portal",
      url: 'https://voters.eci.gov.in/',
      description: "Election Commission of India's official portal for voter registration and EPIC card management.",
    },
    documents: ['Aadhaar Card', 'Age Proof (18+)', 'Address Proof', 'Passport Size Photo'],
    processingTime: '7–30 days',
    eligibility: "Indian citizens who are 18 years of age or older as of January 1st of the qualifying year, and are ordinarily resident in the constituency.",
  },
  'PAN Card': {
    department: 'Income Tax Department, Government of India',
    officeType: {
      name: 'PAN Facilitation Centre / TIN Facilitation Centre',
      searchKeyword: 'PAN card centre Bengaluru',
    },
    portal: {
      name: 'Protean eGov Technologies',
      url: 'https://www.protean-tinpan.com/',
      description: 'Authorised NSDL portal for PAN card new application, correction, and reprinting.',
    },
    documents: ['Aadhaar Card', 'Date of Birth Proof', 'Address Proof', 'Passport Size Photo'],
    processingTime: '15–20 working days',
    eligibility: 'All Indian citizens, entities (firms, companies, NRIs) requiring a Permanent Account Number for tax purposes or financial transactions above ₹50,000.',
  },
  'Aadhaar Update': {
    department: 'Unique Identification Authority of India (UIDAI)',
    officeType: {
      name: 'Aadhaar Seva Kendra',
      searchKeyword: 'Aadhaar Seva Kendra Bengaluru',
    },
    portal: {
      name: 'myAadhaar',
      url: 'https://myaadhaar.uidai.gov.in/',
      description: "UIDAI's self-service portal for address update, demographic changes, and document upload.",
    },
    documents: ['Current Aadhaar Card', 'Valid Address Proof (for address update)', 'Supporting documents for other changes'],
    processingTime: '90 days (online update)',
    eligibility: 'All Aadhaar holders above 5 years of age. Biometric updates are free once every 10 years.',
  },
  'Ration Card': {
    department: 'Food, Civil Supplies & Consumer Affairs Department, Karnataka',
    officeType: {
      name: 'Food Supply Office / Taluk Office',
      searchKeyword: 'Food Supply Office Karnataka',
    },
    portal: {
      name: 'Ahara Karnataka',
      url: 'https://ahara.karnataka.gov.in/',
      description: "Karnataka's official food and civil supplies portal for ration card applications and management.",
    },
    documents: ['Aadhaar Card (all family members)', 'Address Proof', 'Income Proof', 'Gas Connection Details', 'Passport Size Photos'],
    processingTime: '30–60 working days',
    eligibility: 'Karnataka residents not already holding a ration card. Categories include APL, BPL, and Antyodaya (AAY) based on income and social criteria.',
  },
};

// Hardcoded fallback offices keyed by office type keyword for geolocation fallback
export const FALLBACK_OFFICES: Record<string, { name: string; address: string; lat: number; lng: number; phone: string; hours: string }[]> = {
  'Nadakacheri': [
    { name: 'Nadakacheri Bengaluru North', address: 'Rajajinagar, Bengaluru, Karnataka', lat: 13.0039, lng: 77.5543, phone: '080-12345678', hours: '10:00 AM – 5:30 PM' },
    { name: 'Nadakacheri Mysuru', address: 'Saraswathipuram, Mysuru, Karnataka', lat: 12.2958, lng: 76.6394, phone: '0821-234567', hours: '10:00 AM – 5:30 PM' },
    { name: 'Nadakacheri Hubballi', address: 'Vidya Nagar, Hubballi, Karnataka', lat: 15.3647, lng: 75.1240, phone: '0836-222333', hours: '10:00 AM – 5:30 PM' },
  ],
  'RTO': [
    { name: 'RTO Bengaluru East', address: 'Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408, phone: '080-25204053', hours: '10:00 AM – 5:30 PM' },
    { name: 'RTO Mysuru', address: 'Nazarbad, Mysuru, Karnataka', lat: 12.3018, lng: 76.6428, phone: '0821-2440055', hours: '10:00 AM – 5:30 PM' },
  ],
  'Passport': [
    { name: 'Passport Seva Kendra Bengaluru Central', address: 'Sadashivanagar, Bengaluru, Karnataka', lat: 13.0068, lng: 77.5732, phone: '1800-258-1800', hours: '9:00 AM – 5:00 PM' },
    { name: 'Passport Seva Kendra Bengaluru South', address: 'JP Nagar, Bengaluru, Karnataka', lat: 12.9082, lng: 77.5834, phone: '1800-258-1800', hours: '9:00 AM – 5:00 PM' },
  ],
  'Aadhaar': [
    { name: 'Aadhaar Seva Kendra Bengaluru', address: 'Koramangala, Bengaluru, Karnataka', lat: 12.9352, lng: 77.6245, phone: '1947', hours: '9:30 AM – 5:30 PM' },
    { name: 'Aadhaar Seva Kendra Mysuru', address: 'Mysuru, Karnataka', lat: 12.2958, lng: 76.6394, phone: '1947', hours: '9:30 AM – 5:30 PM' },
  ],
  'Municipal': [
    { name: 'BBMP Citizen Service Centre', address: 'Hudson Circle, Bengaluru, Karnataka', lat: 12.9752, lng: 77.5942, phone: '080-22660000', hours: '10:00 AM – 5:30 PM' },
    { name: 'Mysuru City Corporation', address: 'Sayyaji Rao Road, Mysuru, Karnataka', lat: 12.3077, lng: 76.6536, phone: '0821-2420001', hours: '10:00 AM – 5:30 PM' },
  ],
  'default': [
    { name: 'Bangalore One Center – MG Road', address: 'MG Road, Bengaluru, Karnataka', lat: 12.9747, lng: 77.6073, phone: '080-22223333', hours: '10:00 AM – 6:00 PM' },
    { name: 'Bangalore One Center – Jayanagar', address: 'Jayanagar, Bengaluru, Karnataka', lat: 12.9278, lng: 77.5834, phone: '080-22223334', hours: '10:00 AM – 6:00 PM' },
  ],
};

export function getOfficeKey(serviceName: string): string {
  const map: Record<string, string> = {
    'Income Certificate': 'Nadakacheri',
    'Caste Certificate': 'Nadakacheri',
    'Birth Certificate': 'Municipal',
    'Death Certificate': 'Municipal',
    'Driving License': 'RTO',
    'Passport': 'Passport',
    'Voter ID': 'default',
    'PAN Card': 'default',
    'Aadhaar Update': 'Aadhaar',
    'Ration Card': 'Nadakacheri',
  };
  return map[serviceName] ?? 'default';
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
