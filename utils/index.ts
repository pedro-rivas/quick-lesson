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
export const sanitizeFilename = (text:string, maxLength = 100) =>{
    return text
      // 1. Normalize accented characters to their base form
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')            // strip diacritics :contentReference[oaicite:0]{index=0}
      // 2. Replace any character not in A–Z, a–z, 0–9, hyphen or underscore
      .replace(/[^a-zA-Z0-9-_]/g, '_')            // invalid chars → “_” :contentReference[oaicite:1]{index=1}
      // 3. Collapse multiple underscores into one
      .replace(/_+/g, '_')
      // 4. Trim leading/trailing underscores
      .replace(/^_+|_+$/g, '')
      // 5. Enforce max length
      .substring(0, maxLength);
  }