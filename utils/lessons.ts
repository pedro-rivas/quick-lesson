import { VocabularyItem } from "@/store/lessonStore";

/**
 * Creates word exercises from a vocabulary list by generating letter scrambles with distractors.
 * 
 * For each vocabulary item, this function:
 * 1. Extracts the letters from the word (excluding spaces)
 * 2. Generates distractor letters from other words in the vocabulary
 * 3. Combines real letters with distractors and shuffles them
 * 
 * @param vocab - Array of vocabulary items to create exercises from
 * @returns Array of exercise objects, each containing the original word and scrambled letters
 * 
 * @example
 * ```typescript
 * const vocab = [
 *   { term: "hello", definition: "greeting" },
 *   { term: "world", definition: "earth" }
 * ];
 * const exercises = createWordExercises(vocab);
 * // Returns: [
 * //   { word: { term: "hello", definition: "greeting" }, letters: ["h", "e", "l", "l", "o", "w", "r", "d"] },
 * //   { word: { term: "world", definition: "earth" }, letters: ["w", "o", "r", "l", "d", "h", "e", "l"] }
 * // ]
 * ```
 */
export const createWordExercises = (vocab: VocabularyItem[]) => {
  const shuffledWords = vocab.sort(() => Math.random() - 0.5);
  return shuffledWords.map((word) => {
    // 1. Split out the real letters, toss any spaces
    const letters = word.term.split("").filter((l) => l !== " ");

    // 2. Build a pool of all other letters, excluding spaces
    const pool = shuffledWords
      .filter((w) => w.term !== word.term)
      .flatMap((w) => w.term.split(""))
      .filter((l) => l !== " ");

    // 3. Remove any that appear in "letters", then dedupe
    const uniqueDistractors = Array.from(
      new Set(pool.filter((l) => !letters.includes(l)))
    );

    // 4. Pick as many as you need (one fewer than the word length)
    const otherLetters = uniqueDistractors
      .sort(() => Math.random() - 0.5)
      .slice(0, letters.length - 1);

    // 5. Combine real + distractors, shuffle them
    const allLetters = [...letters, ...otherLetters].sort(
      () => Math.random() - 0.5
    );

    return {
      word,
      letters: allLetters,
    };
  });
};
