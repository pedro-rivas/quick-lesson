import english from "@/assets/locales/en-US.json";
import spanish from "@/assets/locales/es-ES.json";
import turkish from "@/assets/locales/tr-TR.json";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// only keep your “canonical” locales here
const resources: { [key: string]: { translation: typeof english } } = {
  "en-US": { translation: english },
  "es-ES": { translation: spanish },
  "tr-TR": { translation: turkish },
};

// map any languageCode to your canonical locale
const fallbackMap: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  tr: "tr-TR",
};

const getBestLocale = () => {
  const [{ languageTag, languageCode }] = Localization.getLocales();
  console.log({ languageTag, languageCode });
  // try the exact tag first
  if (languageTag && resources[languageTag]) {
    return languageTag;
  }
  // else map base code → canonical
  if (languageCode && fallbackMap[languageCode]) {
    return fallbackMap[languageCode];
  }
  // ultimate fallback
  return "en-US";
}

export async function initI18n() {
  try {
    const lng = getBestLocale();

    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: "v4",
        resources,
        lng,
        fallbackLng: "en-US",
        interpolation: {
          // react already safes from xss
          escapeValue: false,
        },
      });

    console.log(`[i18n] initialized with locale "${lng}"`);
  } catch (err) {
    console.error("[i18n] failed to initialize:", err);
  }
}

// run it immediately (or call it from your App entry)
initI18n();

export default i18n;
