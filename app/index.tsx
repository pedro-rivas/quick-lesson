import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import QuickPhrasesSection from "@/components/QuickPhrasesSection";
import QuickTipsSection from "@/components/QuickTipsSection";
import QuickVocabularySection from "@/components/QuickVocabularySection";
import { AVAILABLE_LANGUAGES } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { AntDesign } from "@expo/vector-icons";
import { GoogleGenAI } from "@google/genai";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import {
  termsConfig,
  termsPrompt,
  tipsConfig,
  tipsPrompt,
} from "../api/gemini";

const studentLanguage = "spanish";

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [phrases, setPhrases] = React.useState([]);
  const [vocabulary, setVocabulary] = React.useState([]);
  const [tips, setTips] = React.useState([]);
  const [explanation, setExplanation] = React.useState("");

  const t = useTranslation();

  // const bottomSheetRef = React.useRef<BottomSheet>(null);

  useEffect(() => {
    // textToSpeech("Havaalanına gidelim", "tr-TR").then((uri) => {
    //   console.log("Audio file saved at: ", uri);
    //   const player = createAudioPlayer(uri);
    //   player.play();
    // });
  }, []);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setExplanation("");
    }
  };

  const generate = async () => {
    try {
      setLoading(true);

      const ai = new GoogleGenAI({
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      });
      const model = "gemini-2.0-flash";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `${selectedLanguage} for ${topic}`,
            },
          ],
        },
      ];

      const response: any = await ai.models.generateContent({
        model,
        config: {
          systemInstruction: [
            {
              text: termsPrompt(studentLanguage, selectedLanguage),
            },
          ],
          ...termsConfig,
        },
        contents,
      });

      setPhrases(JSON.parse(response.text).phrases);
      setVocabulary(JSON.parse(response.text).vocabulary);

      const tipsResponse = await ai.models.generateContent({
        model,
        config: {
          systemInstruction: [
            {
              text: tipsPrompt(studentLanguage, selectedLanguage),
            },
          ],
          ...tipsConfig,
        },
        contents,
      });

      if (tipsResponse && tipsResponse.text) {
        setTips(JSON.parse(tipsResponse.text).relevantGrammar);
      } else {
        setTips([]); // Default to empty array if text is undefined
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuickSafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        {selectedLanguage ? (
          <Text style={styles.title}>
            <Text style={styles.bigTitle}>
              {selectedLanguage
                ? selectedLanguage.charAt(0).toUpperCase() +
                  selectedLanguage.slice(1)
                : ""}{" "}
              for
            </Text>
            {"\n"}
            {topic}
          </Text>
        ) : (
          <Text style={styles.title}>{t("screens.home.quickLesson")}</Text>
        )}

        {/* Language and Topic Selection */}
        {!phrases.length && !loading ? (
          <View>
            <RNPickerSelect
              onValueChange={(_, index) =>
                setSelectedLanguage(AVAILABLE_LANGUAGES[index - 1]?.label || "")
              }
              items={[...AVAILABLE_LANGUAGES] as Item[]}
            >
              <View style={styles.picker}>
                <Text style={styles.pickerLabel}>
                  {!selectedLanguage ? "Select Language" : selectedLanguage}
                </Text>
                <AntDesign name={"down"} size={16} color="#0b57d0" />
              </View>
            </RNPickerSelect>

            <TextInput
              placeholder="Taking a taxi"
              onChangeText={(text) => setTopic(text)}
              style={styles.input}
              onSubmitEditing={() => generate()}
              autoFocus
            />

            <Pressable
              onPress={() => generate()}
              disabled={!topic || !selectedLanguage}
              style={[
                styles.button,
                !topic || !selectedLanguage ? { opacity: 0.5 } : { opacity: 1 },
              ]}
            >
              <Text style={styles.buttonText}>Generate</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Vocabulary Section */}
        <QuickVocabularySection vocabulary={vocabulary} />

        {/* Phrases Section */}
        <QuickPhrasesSection phrases={phrases} />

        {/* Tips Section */}
        <QuickTipsSection tips={tips} setExplanation={setExplanation} />

        {loading ? <ActivityIndicator size="large" color="#0b57d0" /> : null}
      </ScrollView>

      {explanation ? (
        <BottomSheet
          //ref={bottomSheetRef}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "#fff" }}
          backgroundStyle={{ backgroundColor: "#0b57d0" }}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <Text style={{ color: "#fff", fontSize: 18 }}>{explanation}</Text>
          </BottomSheetView>
        </BottomSheet>
      ) : null}
    </QuickSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#222",
  },
  picker: {
    backgroundColor: "#f0f4f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerLabel: {
    fontSize: 18,
    marginRight: 4,
  },
  bigTitle: {
    color: "#0b57d0",
    fontSize: 36,
  },
  input: {
    backgroundColor: "#f0f4f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  card: {
    backgroundColor: "#eaf1fb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  term: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 16,
    color: "#5c6bc0",
    marginBottom: 4,
  },
  translation: {
    fontSize: 16,
    color: "#333",
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b57d0",
  },
});
