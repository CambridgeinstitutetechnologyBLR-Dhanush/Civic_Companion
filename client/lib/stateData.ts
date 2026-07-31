// lib/stateData.ts
// All 36 Indian states and Union Territories with their e-governance portals

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Per-state portal info for each service type
export type StatePortal = {
  name: string;
  url: string;
};

// Maps state → service category → portal
export const STATE_PORTALS: Record<string, { general: StatePortal; income?: StatePortal; caste?: StatePortal }> = {
  'Karnataka': {
    general: { name: 'Seva Sindhu', url: 'https://sevasindhuservices.karnataka.gov.in/' },
    income:   { name: 'Seva Sindhu – Income Certificate', url: 'https://sevasindhuservices.karnataka.gov.in/' },
    caste:    { name: 'Seva Sindhu – Caste Certificate',  url: 'https://sevasindhuservices.karnataka.gov.in/' },
  },
  'Tamil Nadu': {
    general: { name: 'TN e-Sevai', url: 'https://www.tnesevai.tn.gov.in/' },
    income:  { name: 'TN e-Sevai – Income Certificate',  url: 'https://www.tnesevai.tn.gov.in/' },
    caste:   { name: 'TN e-Sevai – Community Certificate', url: 'https://www.tnesevai.tn.gov.in/' },
  },
  'Maharashtra': {
    general: { name: 'Aaple Sarkar', url: 'https://aaplesarkar.mahaonline.gov.in/' },
    income:  { name: 'Aaple Sarkar – Income Certificate', url: 'https://aaplesarkar.mahaonline.gov.in/' },
    caste:   { name: 'Aaple Sarkar – Caste Certificate',  url: 'https://aaplesarkar.mahaonline.gov.in/' },
  },
  'Kerala': {
    general: { name: 'e-District Kerala', url: 'https://edistrict.kerala.gov.in/' },
    income:  { name: 'e-District Kerala – Income Certificate', url: 'https://edistrict.kerala.gov.in/' },
    caste:   { name: 'e-District Kerala – Community Certificate', url: 'https://edistrict.kerala.gov.in/' },
  },
  'Andhra Pradesh': {
    general: { name: 'MeeSeva', url: 'https://www.meeseva.gov.in/' },
    income:  { name: 'MeeSeva – Income Certificate',   url: 'https://www.meeseva.gov.in/' },
    caste:   { name: 'MeeSeva – Caste Certificate',    url: 'https://www.meeseva.gov.in/' },
  },
  'Telangana': {
    general: { name: 'MeeSeva Telangana', url: 'https://meeseva.telangana.gov.in/' },
    income:  { name: 'MeeSeva – Income Certificate',   url: 'https://meeseva.telangana.gov.in/' },
    caste:   { name: 'MeeSeva – Caste Certificate',    url: 'https://meeseva.telangana.gov.in/' },
  },
  'Delhi (NCT)': {
    general: { name: 'e-District Delhi', url: 'https://edistrict.delhigovt.nic.in/' },
    income:  { name: 'e-District Delhi – Income Certificate', url: 'https://edistrict.delhigovt.nic.in/' },
    caste:   { name: 'e-District Delhi – SC/ST/OBC Certificate', url: 'https://edistrict.delhigovt.nic.in/' },
  },
  'Uttar Pradesh': {
    general: { name: 'e-Saathi UP', url: 'https://esaathi.up.gov.in/' },
    income:  { name: 'e-Saathi – Income Certificate',  url: 'https://esaathi.up.gov.in/' },
    caste:   { name: 'e-Saathi – Caste Certificate',   url: 'https://esaathi.up.gov.in/' },
  },
  'Rajasthan': {
    general: { name: 'e-Mitra Rajasthan', url: 'https://emitra.rajasthan.gov.in/' },
    income:  { name: 'e-Mitra – Income Certificate',   url: 'https://emitra.rajasthan.gov.in/' },
    caste:   { name: 'e-Mitra – Caste Certificate',    url: 'https://emitra.rajasthan.gov.in/' },
  },
  'Gujarat': {
    general: { name: 'Digital Gujarat', url: 'https://digitalgujarat.gov.in/' },
    income:  { name: 'Digital Gujarat – Income Certificate', url: 'https://digitalgujarat.gov.in/' },
    caste:   { name: 'Digital Gujarat – Caste Certificate',  url: 'https://digitalgujarat.gov.in/' },
  },
  'Madhya Pradesh': {
    general: { name: 'MP e-District', url: 'http://mpedistrict.gov.in/' },
    income:  { name: 'MP e-District – Income Certificate', url: 'http://mpedistrict.gov.in/' },
    caste:   { name: 'MP e-District – Caste Certificate',  url: 'http://mpedistrict.gov.in/' },
  },
  'West Bengal': {
    general: { name: 'e-District West Bengal', url: 'https://edistrict.wb.gov.in/' },
    income:  { name: 'e-District WB – Income Certificate', url: 'https://edistrict.wb.gov.in/' },
    caste:   { name: 'e-District WB – Caste Certificate',  url: 'https://edistrict.wb.gov.in/' },
  },
  'Bihar': {
    general: { name: 'RTPS Bihar', url: 'https://rtps.bihar.gov.in/' },
    income:  { name: 'RTPS – Income Certificate',    url: 'https://rtps.bihar.gov.in/' },
    caste:   { name: 'RTPS – Caste Certificate',     url: 'https://rtps.bihar.gov.in/' },
  },
  'Punjab': {
    general: { name: 'e-District Punjab', url: 'https://punjab.gov.in/' },
  },
  'Haryana': {
    general: { name: 'Saral Haryana', url: 'https://saralharyana.gov.in/' },
  },
  'Assam': {
    general: { name: 'e-District Assam', url: 'https://edistrict.assam.gov.in/' },
  },
  'Odisha': {
    general: { name: 'e-District Odisha', url: 'https://edistrict.odisha.gov.in/' },
  },
  'Jharkhand': {
    general: { name: 'Jharkhand e-District', url: 'https://jharsewa.jharkhand.gov.in/' },
  },
  'Himachal Pradesh': {
    general: { name: 'e-District HP', url: 'https://edistrict.hp.gov.in/' },
  },
  'Uttarakhand': {
    general: { name: 'e-District Uttarakhand', url: 'https://edistrict.uk.gov.in/' },
  },
  'Goa': {
    general: { name: 'Goa Online', url: 'https://goaonline.gov.in/' },
  },
};

// Fallback for states not explicitly mapped
export const DEFAULT_PORTAL: StatePortal = {
  name: 'National e-Governance Portal',
  url: 'https://services.india.gov.in/',
};

export function getPortalForState(state: string): StatePortal {
  return STATE_PORTALS[state]?.general ?? DEFAULT_PORTAL;
}

export function getIncomePortal(state: string): StatePortal {
  return STATE_PORTALS[state]?.income ?? STATE_PORTALS[state]?.general ?? DEFAULT_PORTAL;
}

export function getCastePortal(state: string): StatePortal {
  return STATE_PORTALS[state]?.caste ?? STATE_PORTALS[state]?.general ?? DEFAULT_PORTAL;
}
