import { AVAILABLE_LANGUAGES, LanguageCode } from '@/constants/languages';
import { sanitizeFilename } from '@/utils';
import * as FileSystem from 'expo-file-system';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

/**
 * Synthesizes speech and saves it as an MP3, or returns the existing file.
 *
 * @param {string} text       - The text to synthesize.
 * @param {'en'|'es'|'tr'} lang - Language code: 'en', 'es', or 'tr'.
 * @returns {Promise<string>} URI where the MP3 is stored.
 */
export const textToSpeech = async (text: string, lang: LanguageCode): Promise<string> => {
  const languageCode = AVAILABLE_LANGUAGES.find((l) => l.code === lang)?.code;
  if (!languageCode) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  // Where we'll store it
  const fileUri = `${FileSystem.documentDirectory}${sanitizeFilename(text)}.mp3`;

  // If the file already exists, just return it
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileUri;
  }

  // Build the TTS request
  const body = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Fetch base64 audio
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const { audioContent, error } = await response.json();
  if (error || !audioContent) {
    throw new Error(`TTS synthesis failed: ${error?.message || 'Unknown error'}`);
  }

  // Write base64 data to file
  await FileSystem.writeAsStringAsync(fileUri, audioContent, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}