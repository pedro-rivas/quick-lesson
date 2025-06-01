import { Type } from "@google/genai";

export const termsConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      vocabulary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: {
              type: Type.STRING,
              description: "The term",
              nullable: false,
            },
            transliteration: {
              type: Type.STRING,
              description: "transliteration",
              nullable: true,
            },
            translation: {
              type: Type.STRING,
              description: "meaning",
              nullable: false,
            },
          },
          required: ["term", "transliteration", "translation"],
        },
      },
      phrases: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phrase: {
              type: Type.STRING,
              description: "The full phrase",
              nullable: false,
            },
            transliteration: {
              type: Type.STRING,
              description: "transliteration",
              nullable: true,
            },
            translation: {
              type: Type.STRING,
              description: "translation of the phrase",
              nullable: false,
            },
          },
          required: ["phrase", "transliteration", "translation"],
        },
      },
    },
    required: ["vocabulary", "phrases"],
  },
};


export const tipsConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      relevantGrammar: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "Title of the grammar point",
              nullable: false,
            },
            description: {
              type: Type.STRING,
              description: "Detailed explanation of the grammar topic",
              nullable: false,
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sentence: {
                    type: Type.STRING,
                    description: "Example sentence",
                    nullable: false,
                  },
                  transliteration: {
                    type: Type.STRING,
                    description: "Transliteration for the example sentence",
                    nullable: true,
                  },
                  translation: {
                    type: Type.STRING,
                    description: "Translation of the sentence",
                    nullable: false,
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Breakdown of the example sentence",
                    nullable: false,
                  },
                },
                required: [
                  "sentence",
                  "transliteration",
                  "translation",
                  "explanation",
                ],
              },
            },
          },
          required: ["topic", "description", "examples"],
        },
      },
    },
    required: ["relevantGrammar"],
  },
};