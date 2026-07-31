export type GovernmentService = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  icon: string; // kept for legacy API compat; UI uses ICON_MAP instead
  tone?: string;
};

// Hardcoded catalog — used as fallback when the API is unavailable and
// as the authoritative source for slugs used in navigation.
export const HARDCODED_SERVICES: GovernmentService[] = [
  { slug: 'income-certificate',  name: 'Income Certificate',  description: 'Proof of annual family income for scholarships and schemes.',    icon: '₹',  tone: 'blue'   },
  { slug: 'caste-certificate',   name: 'Caste Certificate',   description: 'Community certificate for education and employment benefits.',    icon: '🪪', tone: 'indigo' },
  { slug: 'birth-certificate',   name: 'Birth Certificate',   description: 'Official record of birth for legal and identity purposes.',       icon: '👶', tone: 'green'  },
  { slug: 'death-certificate',   name: 'Death Certificate',   description: 'Death registration for legal and estate proceedings.',            icon: '📄', tone: 'slate'  },
  { slug: 'driving-license',     name: 'Driving License',     description: 'Learner and driving licence guidance for all vehicles.',          icon: '🚗', tone: 'blue'   },
  { slug: 'passport',            name: 'Passport',            description: 'Passport application, renewal, and appointment booking.',          icon: '✈️', tone: 'indigo' },
  { slug: 'voter-id',            name: 'Voter ID',            description: 'Voter registration and EPIC card correction help.',               icon: '🗳️', tone: 'green'  },
  { slug: 'pan-card',            name: 'PAN Card',            description: 'New, lost, or correction PAN for tax and financial use.',         icon: '💳', tone: 'blue'   },
  { slug: 'aadhaar-update',      name: 'Aadhaar Update',      description: 'Address and demographic updates on your Aadhaar card.',           icon: '👆', tone: 'indigo' },
  { slug: 'ration-card',         name: 'Ration Card',         description: 'Ration card application and household benefit management.',       icon: '🛒', tone: 'green'  },
];

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
}

export async function fetchGovernmentServices(): Promise<GovernmentService[]> {
  try {
    const response = await fetch(`${apiBaseUrl()}/api/services`, { cache: 'no-store' });
    if (!response.ok) return HARDCODED_SERVICES;
    const data = await response.json() as { services?: GovernmentService[] };
    const list = data.services ?? [];
    return list.length > 0 ? list : HARDCODED_SERVICES;
  } catch {
    return HARDCODED_SERVICES;
  }
}

export async function findService(slug: string): Promise<GovernmentService | undefined> {
  // Always resolve against the hardcoded catalog first for reliability
  const local = HARDCODED_SERVICES.find((s) => s.slug === slug);
  if (local) return local;
  const services = await fetchGovernmentServices();
  return services.find((s) => (s.slug ?? s.id) === slug);
}

