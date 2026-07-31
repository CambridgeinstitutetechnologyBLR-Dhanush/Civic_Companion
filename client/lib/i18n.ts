'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../messages/en.json';
import hi from '../messages/hi.json';
import kn from '../messages/kn.json';
import ta from '../messages/ta.json';
import te from '../messages/te.json';
import ml from '../messages/ml.json';
import mr from '../messages/mr.json';
import gu from '../messages/gu.json';
import bn from '../messages/bn.json';
import pa from '../messages/pa.json';
import or from '../messages/or.json';
import as from '../messages/as.json';
import ur from '../messages/ur.json';
import sa from '../messages/sa.json';
import ne from '../messages/ne.json';
import kok from '../messages/kok.json';
import mai from '../messages/mai.json';
import doi from '../messages/doi.json';
import brx from '../messages/brx.json';
import sat from '../messages/sat.json';
import ks from '../messages/ks.json';
import mni from '../messages/mni.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
      ta: { translation: ta },
      te: { translation: te },
      ml: { translation: ml },
      mr: { translation: mr },
      gu: { translation: gu },
      bn: { translation: bn },
      pa: { translation: pa },
      or: { translation: or },
      as: { translation: as },
      ur: { translation: ur },
      sa: { translation: sa },
      ne: { translation: ne },
      kok: { translation: kok },
      mai: { translation: mai },
      doi: { translation: doi },
      brx: { translation: brx },
      sat: { translation: sat },
      ks: { translation: ks },
      mni: { translation: mni },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
