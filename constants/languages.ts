export const AVAILABLE_LANGUAGES = [
    { label: "Español",     value: "spanish",    code: "es-ES" },
    { label: "Türkçe",      value: "turkish",    code: "tr-TR" },
    { label: "English",     value: "english",    code: "en-US" },
    { label: "Português",   value: "portuguese", code: "pt-PT" },
    { label: "Français",    value: "french",     code: "fr-FR" },
    { label: "Deutsch",     value: "german",     code: "de-DE" },
    { label: "Italiano",    value: "italian",    code: "it-IT" },
    { label: "Nederlands",  value: "dutch",      code: "nl-NL" },
    { label: "Norsk",       value: "norwegian",  code: "no-NO" },
    { label: "Polski",      value: "polish",     code: "pl-PL" },
    { label: "Pусский",     value: "russian",    code: "ru-RU" },
    { label: "中文",         value: "chinese",    code: "zh-CN" },
    { label: "日本語",       value: "japanese",   code: "ja-JP" },
    { label: "한국어",       value: "korean",     code: "ko-KR" },
    { label: "Arabic",      value: "arabic",     code: "ar-SA" },
    { label: "Hindi",       value: "hindi",      code: "hi-IN" },
    { label: "Bengali",     value: "bengali",    code: "bn-IN" },
  ] as const;
  
  /** every supported code */
  export type LanguageCode =
    | "es-ES"
    | "tr-TR"
    | "en-US"
    | "pt-PT"
    | "fr-FR"
    | "de-DE"
    | "it-IT"
    | "nl-NL"
    | "no-NO"
    | "pl-PL"
    | "ru-RU"
    | "zh-CN"
    | "ja-JP"
    | "ko-KR"
    | "ar-SA"
    | "hi-IN"
    | "bn-IN";
  
  /** the shape of each item in AVAILABLE_LANGUAGES */
  export type Language = {
    label: string;
    value: string;
    code: LanguageCode;
  };