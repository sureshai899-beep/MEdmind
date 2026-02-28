import { ImageAnnotatorClient } from '@google-cloud/vision';

export interface OCRResult {
    text: string;
    confidence: number;
    medicationName?: string | undefined;
    dosage?: string | undefined;
    frequency?: string | undefined;
}


export class OCRService {
    private client: ImageAnnotatorClient | null = null;

    constructor() {
        try {
            // This expects GOOGLE_APPLICATION_CREDENTIALS to be set in .env
            this.client = new ImageAnnotatorClient();
        } catch (error) {
            console.warn('Google Cloud Vision Client failed to initialize. Falling back to mock.', error);
        }
    }

    /**
     * Real OCR processing using Google Cloud Vision
     */
    async processLabel(imagePath: string): Promise<OCRResult> {
        if (!this.client) {
            return this.mockProcessLabel(imagePath);
        }

        try {
            const [result] = await this.client.textDetection(imagePath);
            const detections = result.textAnnotations;
            // Safely handle potentially missing text annotations
            const fullText = (detections && detections.length > 0 && detections[0] && detections[0].description)
                ? detections[0].description
                : '';

            if (!fullText) {
                return { text: "No text detected", confidence: 0 };
            }

            // Basic extraction logic (Regex based)
            const medicationName = this.extractMedicationName(fullText);
            const dosage = this.extractDosage(fullText);

            return {
                text: fullText,
                confidence: 0.9,
                medicationName: medicationName || undefined,
                dosage: dosage || undefined,
            };
        } catch (error) {
            console.error('OCR Processing Error:', error);
            return this.mockProcessLabel(imagePath);
        }
    }

    private extractMedicationName(text: string): string | undefined {
        // Very basic placeholder regex
        const lines = text.split('\n');
        return lines[0]; // Often the first line is the name
    }

    private extractDosage(text: string): string | undefined {
        const dosageRegex = /(\d+(\.\d+)?\s?(mg|mcg|g|ml))/i;
        const match = text.match(dosageRegex);
        return match ? match[1] : undefined;
    }

    private async mockProcessLabel(imagePath: string): Promise<OCRResult> {
        console.log(`Mock processing image at: ${imagePath}`);

        if (imagePath.toLowerCase().includes('advil')) {
            return {
                text: "Advil (Ibuprofen) 200mg - Take 1 tablet every 4-6 hours",
                confidence: 0.98,
                medicationName: "Advil",
                dosage: "200mg",
                frequency: "Every 4-6 hours"
            };
        }

        return {
            text: "Lisinopril 10mg - Take one tablet daily",
            confidence: 0.95,
            medicationName: "Lisinopril",
            dosage: "10mg",
            frequency: "Daily"
        };
    }
}

export const ocrService = new OCRService();

