import { GEMINI_API_KEY } from "@/constants/config";
import { GenerateContentParameters, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
