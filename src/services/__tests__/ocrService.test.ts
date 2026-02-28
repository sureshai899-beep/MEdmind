import TextRecognition from '@react-native-ml-kit/text-recognition';
import { recognizeText, isValidMedicationResult } from '../ocrService';

jest.mock('@react-native-ml-kit/text-recognition', () => ({
    recognize: jest.fn(),
}));

describe('ocrService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('recognizeText', () => {
        it('should return null if no text is recognized', async () => {
            (TextRecognition.recognize as jest.Mock).mockResolvedValue(null);
            const result = await recognizeText('test-uri');
            expect(result).toBeNull();
        });

        it('should parse medication information correctly', async () => {
            const mockResult = {
                text: 'Lisinopril\n10mg\nTake once daily',
                blocks: [{ text: 'Lisinopril' }, { text: '10mg' }, { text: 'Take once daily' }],
            };
            (TextRecognition.recognize as jest.Mock).mockResolvedValue(mockResult);

            const result = await recognizeText('test-uri');
            expect(result).toEqual({
                text: mockResult.text,
                confidence: expect.any(Number),
                medicationName: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Take once daily',
            });
        });

        it('should fallback to first line for medication name if pattern doesn\'t match', async () => {
            const mockResult = {
                text: 'UnknownDrug123\n500mg\ndaily',
                blocks: [{ text: 'UnknownDrug123' }],
            };
            (TextRecognition.recognize as jest.Mock).mockResolvedValue(mockResult);

            const result = await recognizeText('test-uri');
            expect(result?.medicationName).toBe('UnknownDrug123');
        });
    });

    describe('isValidMedicationResult', () => {
        it('should return false for null result', () => {
            expect(isValidMedicationResult(null)).toBe(false);
        });

        it('should return true if name is present', () => {
            expect(isValidMedicationResult({ text: '', confidence: 0.8, medicationName: 'Advil' })).toBe(true);
        });

        it('should return true if dosage is present', () => {
            expect(isValidMedicationResult({ text: '', confidence: 0.8, dosage: '10mg' })).toBe(true);
        });

        it('should return false if both name and dosage are missing', () => {
            expect(isValidMedicationResult({ text: 'just random text', confidence: 0.8 })).toBe(false);
        });
    });
});
