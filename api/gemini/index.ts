import { GenerateContentParameters, GoogleGenAI } from "@google/genai";
import { termsPrompt, tipsPrompt } from "./prompts";
import { termsConfig, tipsConfig } from "./schemas";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
});

const DEFAULT_MODEL = "gemini-2.0-flash";

export const generateContent = async ({
  model = DEFAULT_MODEL,
  config,
  contents,
}: {
  model?: string;
  config: GenerateContentParameters["config"];
  contents: GenerateContentParameters["contents"];
}) => {
  return ai.models.generateContent({
    model,
    config,
    contents,
  });
};

export const createLesson = async ({
  studentLanguage,
  selectedLanguage,
  topic,
}: {
  studentLanguage: string;
  selectedLanguage: string;
  topic: string;
}) => {
  const contents = [
    {
      role: "user",
      parts: [{ text: `${selectedLanguage} for ${topic}` }],
    },
  ];

  const termsRequest = generateContent({
    config: {
      systemInstruction: [
        { text: termsPrompt(studentLanguage, selectedLanguage) },
      ],
      ...termsConfig,
    },
    contents,
  });

  const tipsRequest = generateContent({
    config: {
      systemInstruction: [
        { text: tipsPrompt(studentLanguage, selectedLanguage) },
      ],
      ...tipsConfig,
    },
    contents,
  });

 
  const [termsResponse, tipsResponse] = await Promise.all([
    termsRequest,
    tipsRequest,
  ]);

  
  const parsedTerms = JSON.parse(termsResponse?.text || "");
  const generatedPhrases = parsedTerms.phrases;
  const generatedVocabulary = parsedTerms.vocabulary;

  let generatedTips: any[] = [];
  if (tipsResponse?.text) {
    const parsedTips = JSON.parse(tipsResponse.text);
    generatedTips = parsedTips.relevantGrammar || [];
  }

  return {
    title: `${selectedLanguage} for ${topic}`,
    language: selectedLanguage,
    topic,
    phrases: generatedPhrases,
    vocabulary: generatedVocabulary,
    relevantGrammar: generatedTips,
  };
};
