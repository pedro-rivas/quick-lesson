
/**
 * Turns any string into a safe filename segment:
 *  • Removes diacritics (accents)
 *  • Replaces invalid chars with underscores
 *  • Truncates to a reasonable length
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const sanitizeFilename = (text: string, maxLength = 100) => {
  return (
    text
      // 1. Normalize accented characters to their base form
      .normalize("NFKD")
      .replace(/[\u0300-\u036F]/g, "") // strip diacritics :contentReference[oaicite:0]{index=0}
      // 2. Replace any character not in A–Z, a–z, 0–9, hyphen or underscore
      .replace(/[^a-zA-Z0-9-_]/g, "_") // invalid chars → “_” :contentReference[oaicite:1]{index=1}
      // 3. Collapse multiple underscores into one
      .replace(/_+/g, "_")
      // 4. Trim leading/trailing underscores
      .replace(/^_+|_+$/g, "")
      // 5. Enforce max length
      .substring(0, maxLength)
  );
};

/**
 * Shuffles an array using the Fisher-Yates shuffle algorithm.
 * Creates a new array with the elements randomly reordered, leaving the original array unchanged.
 *
 * @template T - The type of elements in the array
 * @param arr - The array to shuffle
 * @returns A new array with the same elements in random order
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(numbers);
 * console.log(shuffled); // e.g., [3, 1, 5, 2, 4]
 * console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)
 * ```
 */
export const shuffleArray = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};