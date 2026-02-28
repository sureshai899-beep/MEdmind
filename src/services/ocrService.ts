import TextRecognition from '@react-native-ml-kit/text-recognition';

/**
 * OCR Service using Google ML Kit.
 * Extracts text from medication packaging images and attempts to parse
 * structural information like medication name, dosage, and frequency.
 */

/**
 * Represents the structured result from an OCR scan.
 * @interface OCRResult
 * @property {string} text - The raw text recognized from the image.
 * @property {number} confidence - Estimated confidence score (0 to 1).
 * @property {string} [medicationName] - Extracted medication name (e.g., "Lisinopril").
 * @property {string} [dosage] - Extracted dosage strength (e.g., "10mg").
 * @property {string} [frequency] - Extracted frequency instruction (e.g., "Once daily").
 */
export interface OCRResult {
    text: string;
    confidence: number;
    medicationName?: string;
    dosage?: string;
    frequency?: string;
}

/**
 * Perform text recognition on an image at the given URI.
 * @param {string} imageUri - Local URI of the image to process.
 * @returns {Promise<OCRResult | null>} A promise resolving to the OCRResult or null if recognition fails.
 */
export async function recognizeText(imageUri: string): Promise<OCRResult | null> {
    try {
        const result = await TextRecognition.recognize(imageUri);

        if (!result || !result.text) {
            return null;
        }

        // Parse the recognized text for medication information
        const parsed = parseMedicationInfo(result.text);

        return {
            text: result.text,
            confidence: calculateConfidence(result),
            ...parsed,
        };
    } catch (error) {
        console.error('OCR Error:', error);
        return null;
    }
}

/**
 * Estimate a confidence level for the ML Kit result.
 * Since ML Kit for React Native doesn't expose raw confidence scores yet,
 * we use a heuristic based on text block structure.
 * @param {any} result - The ML Kit recognition result object.
 * @returns {number} Confidence score between 0 and 1.
 * @private
 */
function calculateConfidence(result: any): number {
    // ML Kit doesn't provide direct confidence, estimate based on blocks
    if (!result.blocks || result.blocks.length === 0) return 0;

    // Simple heuristic: more blocks with text = higher confidence
    const avgBlockLength = result.blocks.reduce((sum: number, block: any) =>
        sum + (block.text?.length || 0), 0) / result.blocks.length;

    return Math.min(avgBlockLength / 20, 1); // Normalize to 0-1
}

/**
 * Parse medication information from a raw text string.
 * Uses a combination of regex patterns and contextual logic to identify
 * medication names, dosages, and common medical frequencies.
 * @param {string} text - The raw text to parse.
 * @returns {Partial<OCRResult>} An object containing extracted fields.
 * @private
 */
function parseMedicationInfo(text: string): Partial<OCRResult> {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

    let medicationName: string | undefined;
    let dosage: string | undefined;
    let frequency: string | undefined;

    // Common medication name patterns (usually first significant line)
    const namePattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/;

    // Dosage patterns: "10mg", "500 mg", "2.5mg", "0.5ml", etc.
    const dosagePattern = /(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|units?|iu|tabs?|caps?)/i;

    // Frequency patterns: "once daily", "twice a day", "every 8 hours", etc.
    const frequencyPatterns = [
        /(?:take\s+)?(\d+)\s+times?\s+(?:a\s+)?(?:per\s+)?(?:day|daily)/i,
        /(?:take\s+)?once\s+(?:a\s+)?(?:per\s+)?(?:day|daily)/i,
        /(?:take\s+)?twice\s+(?:a\s+)?(?:per\s+)?(?:day|daily)/i,
        /every\s+(\d+)\s+(?:hours?|hrs?)/i,
        /at\s+bedtime/i,
        /morning\s+and\s+evening/i,
        /(?:take\s+)?(?:one|two|three)\s+(?:tablet|capsule|pill)s?\s+(?:daily|per day)/i,
    ];

    for (const line of lines) {
        // Try to find medication name (usually capitalized, early in text)
        if (!medicationName && namePattern.test(line) && line.length > 3) {
            medicationName = line;
        }

        // Try to find dosage
        if (!dosage) {
            const dosageMatch = line.match(dosagePattern);
            if (dosageMatch) {
                dosage = dosageMatch[0];
            }
        }

        // Try to find frequency
        if (!frequency) {
            for (const pattern of frequencyPatterns) {
                const match = line.match(pattern);
                if (match) {
                    frequency = match[0];
                    break;
                }
            }
        }

        // Stop if we found everything
        if (medicationName && dosage && frequency) break;
    }

    // Fallback: if no medication name found, use first line
    if (!medicationName && lines.length > 0) {
        medicationName = lines[0];
    }

    // Fallback: if no frequency found but found "daily" or similar
    if (!frequency && text.toLowerCase().includes('daily')) {
        frequency = 'Once daily';
    }

    return {
        medicationName,
        dosage,
        frequency,
    };
}

/**
 * Helper to determine if an OCR result contains enough data to be useful.
 * @param {OCRResult | null} result - The result object to validate.
 * @returns {boolean} True if the result has either a name or dosage.
 */
export function isValidMedicationResult(result: OCRResult | null): boolean {
    if (!result) return false;

    // Must have at least medication name or dosage
    return !!(result.medicationName || result.dosage);
}
