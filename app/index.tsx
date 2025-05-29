import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import LessonCard from "@/components/LessonCard";
import LessonEmptyState from "@/components/LessonEmptyState";
import LessonGeneratorForm from "@/components/LessonGeneratorForm";
import QuickButton from "@/components/QuickButton";
import useTranslation from "@/hooks/useTranslation";
import { GrammarTip, Lesson, Phrase, useLessonStore, VocabularyItem } from "@/store/lessonStore";
import { GoogleGenAI } from "@google/genai";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
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
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);

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
      setShowBottomSheet(false);
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
          <LessonGeneratorForm
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            topic={topic}
            onTopicChange={setTopic}
            onGenerate={generate}
            isGenerating={loading}
          />
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
            <LessonEmptyState />
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
              ListFooterComponent={()=> (
                <QuickButton
                  onPress={()=> {setShowBottomSheet(true)}}
                  title="Generate"
                />
              )}
            />
          )}
        </View>
        {/* --- End My Lessons Section --- */}

      </ScrollView>

      {showBottomSheet ? (
        <BottomSheet
          //ref={bottomSheetRef}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          // handleIndicatorStyle={{ backgroundColor: "#fff" }}
          // backgroundStyle={{ backgroundColor: "#0b57d0" }}
          //keyboardBehavior={'fillParent'}
        >
          <BottomSheetView style={styles.bottomSheetView}>
          <LessonGeneratorForm
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            topic={topic}
            onTopicChange={setTopic}
            onGenerate={generate}
            isGenerating={loading}
          />
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
  bigTitle: {
    color: "#0b57d0",
    fontSize: 36,
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    // backgroundColor: "#0b57d0",
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
});
