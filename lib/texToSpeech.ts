import { BUCKET, ELEVEN_LABS_API_KEY, TABLE_NAME } from "@/constants/config";
import { LANGUAGES, LanguageCode } from "@/constants/languages";
import { sha256 } from "@/utils/language";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { SpeechService } from "./speechService";
import { supabase } from "./supabase";

const speechService = new SpeechService(ELEVEN_LABS_API_KEY);

/**
 * Synthesizes speech and saves it as an MP3, or returns the existing file.
 *
 * @param {string} text       - The text to synthesize.
 * @param {'en'|'es'|'tr'} lang - Language code: 'en', 'es', or 'tr'.
 * @returns {Promise<string>} URI where the MP3 is stored.
 */
export const textToSpeech = async (
  text: string,
  lang: LanguageCode
): Promise<string> => {
  if (!LANGUAGES[lang]) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const s256 = await sha256(text);
  const baseName = `${lang}-${text.length}${s256}`;
  const fileName = `${baseName}.mp3`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  // Return from cache if it exists
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    //console.log(`File already exists at ${fileUri}`);
    return fileUri;
  }

  // Return from database if it exists
  const existingFileUri = await getFileFromDatabase(text, lang, fileUri);
  if (existingFileUri) {
    //console.log(`Found existing file in database: ${existingFileUri}`);
    return existingFileUri;
  }

  // Fetch the audio content from the TTS service
  const audioContent = await speechService.speak(text);

  if (!audioContent?.audio_url) {
    throw new Error(`TTS synthesis failed: ${"Unknown error"}`);
  }

  // Write base64 data to file
  const uri = await writeFileInDisk(fileUri, audioContent.audio_url);

  //console.log(`Synthesized speech saved to ${uri}`);

  saveFileInDatabase({
    baseName,
    fileUri: uri,
    text,
    lang,
  });

  return uri;
};

const saveFileInDatabase = async ({
  baseName,
  fileUri,
  text,
  lang,
}: {
  baseName: string;
  fileUri: string;
  text: string;
  lang: LanguageCode;
}) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "base64",
    });

    const storagePath = `${baseName}.mp3`;

    // b) Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, decode(base64), {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from(TABLE_NAME).insert({
      text,
      language: lang,
      storage_path: storagePath,
    });

    if (insertError) {
      console.error(
        "Supabase DB insert error for TTS row:",
        insertError.message
      );
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }
  } catch (e) {
    console.error("Unexpected error while uploading new TTS to Supabase:", e);
  }
};

const getFileFromDatabase = async (
  text: string,
  lang: string,
  fileUri: string
) => {
  const { data: existingRow, error: selectError } = await supabase
    .from(TABLE_NAME)
    .select("storage_path")
    .eq("text", text)
    .eq("language", lang)
    .limit(1)
    .maybeSingle();

  if (selectError) {
    console.warn("Supabase select error:", selectError.message);
    return null;
  } else if (existingRow && existingRow.storage_path) {
    // We found a row in the DB.
    const storagePath = existingRow.storage_path;
    const keyInBucket = storagePath.startsWith(`${BUCKET}/`)
      ? storagePath.replace(`${BUCKET}/`, "")
      : storagePath;

    // Get a public URL for that object
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(keyInBucket);

    if (publicUrl) {
      // We’ll fall back to re-synthesizing in the code below.
      await FileSystem.downloadAsync(publicUrl, fileUri);
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: "base64",
      });
      const uri = await writeFileInDisk(fileUri, base64);
      return uri;
    } else {
      return null;
    }
  }
};

const writeFileInDisk = async (uri: string, content: string) => {
  await FileSystem.writeAsStringAsync(uri, content, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return uri;
};
