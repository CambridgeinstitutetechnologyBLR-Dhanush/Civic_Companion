const fs = require('fs');
const path = require('path');

const langs = [
  'en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr', 'gu', 'bn', 'pa', 'or', 'as', 
  'ur', 'sa', 'ne', 'kok', 'mai', 'doi', 'brx', 'sat', 'ks', 'mni'
];

const dir = path.join(__dirname, 'messages');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const enContent = {
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "services": "Services",
    "downloads": "Downloads",
    "support": "Support",
    "profile": "Profile"
  },
  "home": {
    "hero_title": "Government services, made simple",
    "hero_subtitle": "Your personalized guide to documents, applications, and official procedures.",
    "get_started": "Get started",
    "popular_services": "Popular services"
  },
  "services": {
    "income_certificate": "Income Certificate",
    "caste_certificate": "Caste Certificate",
    "birth_certificate": "Birth Certificate",
    "death_certificate": "Death Certificate",
    "driving_license": "Driving License",
    "passport": "Passport",
    "voter_id": "Voter ID",
    "pan_card": "PAN Card",
    "aadhaar_update": "Aadhaar Update",
    "ration_card": "Ration Card"
  },
  "action": {
    "apply_online": "Apply Online",
    "create_plan": "Create My Action Plan",
    "track": "Track Application"
  }
};

const hiContent = {
  "navigation": {
    "home": "होम",
    "dashboard": "डैशबोर्ड",
    "services": "सेवाएं",
    "downloads": "डाउनलोड",
    "support": "सहायता",
    "profile": "प्रोफ़ाइल"
  },
  "home": {
    "hero_title": "सरकारी सेवाएं, अब आसान",
    "hero_subtitle": "दस्तावेज़ों, आवेदनों और आधिकारिक प्रक्रियाओं के लिए आपका व्यक्तिगत मार्गदर्शक।",
    "get_started": "शुरू करें",
    "popular_services": "लोकप्रिय सेवाएं"
  },
  "services": {
    "income_certificate": "आय प्रमाण पत्र",
    "caste_certificate": "जाति प्रमाण पत्र",
    "birth_certificate": "जन्म प्रमाण पत्र",
    "death_certificate": "मृत्यु प्रमाण पत्र",
    "driving_license": "ड्राइविंग लाइसेंस",
    "passport": "पासपोर्ट",
    "voter_id": "वोटर आईडी",
    "pan_card": "पैन कार्ड",
    "aadhaar_update": "आधार अपडेट",
    "ration_card": "राशन कार्ड"
  },
  "action": {
    "apply_online": "ऑनलाइन आवेदन करें",
    "create_plan": "मेरी कार्य योजना बनाएं",
    "track": "आवेदन ट्रैक करें"
  }
};

const knContent = {
  "navigation": {
    "home": "ಮುಖಪುಟ",
    "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "services": "ಸೇವೆಗಳು",
    "downloads": "ಡೌನ್‌ಲೋಡ್‌ಗಳು",
    "support": "ಬೆಂಬಲ",
    "profile": "ಪ್ರೊಫೈಲ್"
  },
  "home": {
    "hero_title": "ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ಈಗ ಸುಲಭ",
    "hero_subtitle": "ದಾಖಲೆಗಳು, ಅರ್ಜಿಗಳು ಮತ್ತು ಅಧಿಕೃತ ಪ್ರಕ್ರಿಯೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶಿ.",
    "get_started": "ಪ್ರಾರಂಭಿಸಿ",
    "popular_services": "ಜನಪ್ರಿಯ ಸೇವೆಗಳು"
  },
  "services": {
    "income_certificate": "ಆದಾಯ ಪ್ರಮಾಣ ಪತ್ರ",
    "caste_certificate": "ಜಾತಿ ಪ್ರಮಾಣ ಪತ್ರ",
    "birth_certificate": "ಜನನ ಪ್ರಮಾಣ ಪತ್ರ",
    "death_certificate": "ಮರಣ ಪ್ರಮಾಣ ಪತ್ರ",
    "driving_license": "ಚಾಲನಾ ಪರವಾನಗಿ",
    "passport": "ಪಾಸ್‌ಪೋರ್ಟ್",
    "voter_id": "ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ",
    "pan_card": "ಪ್ಯಾನ್ ಕಾರ್ಡ್",
    "aadhaar_update": "ಆಧಾರ್ ಅಪ್‌ಡೇಟ್",
    "ration_card": "ಪಡಿತರ ಚೀಟಿ"
  },
  "action": {
    "apply_online": "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    "create_plan": "ನನ್ನ ಕ್ರಿಯಾ ಯೋಜನೆಯನ್ನು ರಚಿಸಿ",
    "track": "ಅರ್ಜಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ"
  }
};

langs.forEach(lang => {
  const p = path.join(dir, `${lang}.json`);
  let content = {};
  if (lang === 'en') content = enContent;
  else if (lang === 'hi') content = hiContent;
  else if (lang === 'kn') content = knContent;
  
  fs.writeFileSync(p, JSON.stringify(content, null, 2));
});

console.log('Successfully created all 22 translation files.');
