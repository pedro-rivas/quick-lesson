import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import LessonCard from "@/components/LessonCard";
import { AVAILABLE_LANGUAGES } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { GrammarTip, Lesson, Phrase, useLessonStore, VocabularyItem } from "@/store/lessonStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { GoogleGenAI } from "@google/genai";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
  const [phrases, setPhrases] = React.useState<Phrase[]>([]);
  const [vocabulary, setVocabulary] = React.useState<VocabularyItem[]>([]);
  const [tips, setTips] = React.useState<GrammarTip[]>([]);
  const [explanation, setExplanation] = React.useState("");

  const { addLesson, getAllLessons, removeLesson } = useLessonStore();
  const lessons = getAllLessons();
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

      const generatedPhrases = JSON.parse(response.text).phrases;
      const generatedVocabulary = JSON.parse(response.text).vocabulary;

      setPhrases(generatedPhrases);
      setVocabulary(generatedVocabulary);

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

      let generatedTips = [];
      if (tipsResponse && tipsResponse.text) {
        generatedTips = JSON.parse(tipsResponse.text).relevantGrammar;
        setTips(generatedTips);
      } else {
        setTips([]);
      }

      // Save the lesson to the store
      const lessonId = addLesson({
        title: `${selectedLanguage} for ${topic}`,
        language: selectedLanguage,
        topic: topic,
        phrases: generatedPhrases,
        vocabulary: generatedVocabulary,
        relevantGrammar: generatedTips,
      });

      console.log("Lesson saved with ID:", lessonId);
    } catch (error) {
      console.error("Error generating lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = (id: string, title: string) => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeLesson(id),
        },
      ]
    );
  };

  const handleViewLesson = (lesson: Lesson) => {
    router.push(`/lessons/${lesson.id}` as any);
  };

  return (
    <QuickSafeAreaView>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
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
        {!loading ? (
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


        {loading ? <ActivityIndicator size="large" color="#0b57d0" style={{ marginTop: 20 }}/> : null}

        {/* --- My Lessons Section --- */}
        <View style={styles.lessonsSectionContainer}>
          <View style={styles.lessonsHeader}>
            <Text style={styles.lessonsTitle}>My Lessons</Text>
            {lessons.length > 0 && (
              <Text style={styles.lessonsSubtitle}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</Text>
            )}
          </View>
          
          {lessons.length === 0 && !loading ? (
            <View style={styles.lessonEmptyState}>
              <MaterialIcons name="school" size={64} color="#ccc" />
              <Text style={styles.lessonEmptyTitle}>No lessons yet</Text>
              <Text style={styles.lessonEmptySubtitle}>
                Generate your first lesson using the form above.
              </Text>
            </View>
          ) : (
            <FlatList
              data={lessons}
              renderItem={({ item }) => (
                <LessonCard 
                  lesson={item} 
                  onView={handleViewLesson} 
                  onDelete={handleDeleteLesson} 
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.lessonListContainer}
              scrollEnabled={false}
            />
          )}
        </View>
        {/* --- End My Lessons Section --- */}

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
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b57d0",
  },
  lessonsSectionContainer: {
    marginTop: 32,
  },
  lessonsHeader: {
    marginBottom: 24,
  },
  lessonsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  lessonsSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  lessonListContainer: {
    paddingBottom: 20,
  },
  lessonEmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    minHeight: 200,
  },
  lessonEmptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  lessonEmptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
});
