import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import { textToSpeech } from "@/lib/texToSpeech";
import { AntDesign } from "@expo/vector-icons";
import { GoogleGenAI } from "@google/genai";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { createAudioPlayer } from 'expo-audio';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNPickerSelect from "react-native-picker-select";
import { termsConfig, termsPrompt, tipsConfig, tipsPrompt } from "../api/gemini";

const studentLanguage = "spanish";

const languages = [
  { label: "Español", value: "spanish" },
  { label: "Türkçe", value: "turkish" },
  { label: "Português", value: "portuguese" },
  { label: "Français", value: "french" },
  { label: "Deutsch", value: "german" },
  { label: "Italiano", value: "italian" },
  { label: "Nederlands", value: "dutch" },
  { label: "Norsk", value: "norwegian" },
  { label: "Polski", value: "polish" },
  { label: "Pусский", value: "russian" },
  { label: "中文", value: "chinese" },
  { label: "日本語", value: "japanese" },
  { label: "한국어", value: "korean" },
  { label: "Arabic", value: "arabic" },
  { label: "Hindi", value: "hindi" },
  { label: "Bengali", value: "bengali" },
];

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [phrases, setPhrases] = React.useState([]);
  const [vocabulary, setVocabulary] = React.useState([]);
  const [tips, setTips] = React.useState([]);
  const [explanation, setExplanation] = React.useState("");

  // const bottomSheetRef = React.useRef<BottomSheet>(null);

  useEffect(()=> {
    textToSpeech("Havaalanına gidelim", 'tr').then((uri) => {
      console.log("Audio file saved at: ", uri);
      const player = createAudioPlayer(uri);
      player.play();
    })
  }, [])

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
            }
          ],
          ...tipsConfig
        },
        contents,
      });

      setTips(JSON.parse(tipsResponse.text).relevantGrammar);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <QuickSafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        {selectedLanguage ? (
          <Text style={styles.title}>
            <Text style={styles.bigTitle}>
              {selectedLanguage?.charAt(0)?.toUpperCase() +
                selectedLanguage.slice(1)}{" "}
              for
            </Text>
            {"\n"}
            {topic}
          </Text>
        ) : (
          <Text style={styles.title}>Quick Lesson</Text>
        )}

        {/* Language and Topic Selection */}
        {!phrases.length && !loading ? (
          <View>
            <RNPickerSelect
              onValueChange={(value, index) =>
                setSelectedLanguage(languages[index - 1].label)
              }
              items={languages}
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
        {vocabulary.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sectionTitle}>Vocabulary</Text>
            {vocabulary.map((vocab: any, idx) => (
              <View key={idx} style={styles.card}>
                <View>
                  <Text style={styles.term}>{vocab.term}</Text>
                  {vocab.transliteration ? (
                    <Text style={styles.transliteration}>
                      {vocab.transliteration}
                    </Text>
                  ) : null}
                  <Text style={styles.translation}>{vocab.translation}</Text>
                </View>
                <AntDesign name="sound" size={20} color="#1a237e" />
              </View>
            ))}
          </View>
        )}

        {/* Phrases Section */}
        {phrases.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sectionTitle}>Phrases</Text>
            {phrases.map((phrase: any, idx) => (
              <View key={idx} style={styles.card}>
                <View>
                  <Text style={styles.term}>{phrase.phrase}</Text>
                  {phrase.transliteration ? (
                    <Text style={styles.transliteration}>
                      {phrase.transliteration}
                    </Text>
                  ) : null}
                  <Text style={styles.translation}>{phrase.translation}</Text>
                </View>
                <AntDesign name="sound" size={20} color="#1a237e" />
              </View>
            ))}
          </View>
        )}

        {/* Tips Section */}
        {tips.length > 0 && (
              <View style={{ marginBottom: 32 }}>
                <Text style={styles.sectionTitle}>Tips</Text>
                {tips.map((tip:any, idx) => (
                  <View key={idx} style={styles.tipCard}>
                    <Text style={styles.tipTopic}>{tip.topic}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                    {tip.examples && tip.examples.length > 0 && (
                      <View style={{ marginTop: 24 }}>
                        <Text style={styles.examplesLabel}>EXAMPLES</Text>
                        <View style={styles.examplesRow}>
                          {tip.examples.map((ex: any, exIdx: number) => (
                            <View key={exIdx} style={styles.exampleCard}>
                              <Pressable onPress={() => setExplanation(ex.explanation)}>
                                <Text style={styles.exampleGerman}>
                                  <AntDesign name={'infocirlceo'} size={15} color="#1a237e" />
                                  {' ' + ex.sentence}
                                </Text>

                                <Text style={styles.exampleEnglish}>{ex.translation}</Text>
                              </Pressable>
                              <AntDesign name="sound" size={20} color="#1a237e" />
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}


        {loading ? <ActivityIndicator size="large" color="#0b57d0" /> : null}
      </ScrollView>

      {
            explanation ? <BottomSheet
              //ref={bottomSheetRef}
              onChange={handleSheetChanges}
              enablePanDownToClose={true}
              handleIndicatorStyle={{ backgroundColor: '#fff' }}
              backgroundStyle={{ backgroundColor: '#0b57d0' }}
            >
              <BottomSheetView style={styles.bottomSheetView} >
                <Text style={{ color: '#fff', fontSize: 18 }}>{
                  explanation
                }</Text>
              </BottomSheetView>
            </BottomSheet>
              : null
          }
    </QuickSafeAreaView>
    </GestureHandlerRootView>
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
    marginBottom: 4
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
  tipCard: {
    backgroundColor: '#eaf4fb',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTopic: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  examplesLabel: {
    fontSize: 13,
    color: '#7b8a97',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  examplesRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  exampleCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    minWidth: 180,
    marginBottom: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exampleGerman: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  exampleEnglish: {
    fontSize: 15,
    color: '#444',
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0b57d0',
  },
});
