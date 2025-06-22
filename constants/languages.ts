  /** every supported code */
  export type LanguageCode =
    | "es-ES"
    | "tr-TR"
    | "en-US"
    | "pt-PT"
    | "fr-FR"
    | "de-DE"
    | "it-IT"
    // | "nl-NL"
    // | "no-NO"
    // | "pl-PL"
    // | "ru-RU"
    // | "zh-CN"
    // | "ja-JP"
    // | "ko-KR"
    // | "ar-SA"
    // | "hi-IN"
    // | "bn-IN";
  
  /** the shape of each item in AVAILABLE_LANGUAGES */
  export type Language = {
    label: string;
    value: string;
    code: LanguageCode;
  };

export const LANGUAGES: Record<LanguageCode, {
  label: string;
  value: string;
  code: LanguageCode;
}> = {
  "es-ES":    { label: "Español",     value: "spanish",    code: "es-ES",},
  "tr-TR":    { label: "Türkçe",      value: "turkish",    code: "tr-TR" },
  "en-US":    { label: "English",     value: "english",    code: "en-US" },
  "pt-PT":    { label: "Português",   value: "portuguese", code: "pt-PT" },
  "fr-FR":    { label: "Français",    value: "french",     code: "fr-FR" },
  "de-DE":    { label: "Deutsch",     value: "german",     code: "de-DE" },
  "it-IT":    { label: "Italiano",    value: "italian",    code: "it-IT" },
  // "nl-NL":    { label: "Nederlands",  value: "dutch",      code: "nl-NL" },
  // "no-NO":    { label: "Norsk",       value: "norwegian",  code: "no-NO" },
  // "pl-PL":    { label: "Polski",      value: "polish",     code: "pl-PL" },
  // "ru-RU":    { label: "Pусский",     value: "russian",    code: "ru-RU" },
  // "zh-CN":    { label: "中文",         value: "chinese",    code: "zh-CN" },
  // "ja-JP":    { label: "日本語",       value: "japanese",   code: "ja-JP" },
  // "ko-KR":    { label: "한국어",       value: "korean",     code: "ko-KR" },
  // "ar-SA":    { label: "Arabic",      value: "arabic",     code: "ar-SA" },
  // "hi-IN":    { label: "Hindi",       value: "hindi",      code: "hi-IN" },
  // "bn-IN":    { label: "Bengali",     value: "bengali",    code: "bn-IN" },
}

export const AVAILABLE_LANGUAGES = Object.values(LANGUAGES)