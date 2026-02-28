import { UserSchema, MedicationSchema, OCRResultSchema } from '../schemas';

describe('schemas', () => {
    describe('UserSchema', () => {
        const validUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            age: 30,
        };

        it('should validate a correct user object', () => {
            const result = UserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
        });

        it('should fail on invalid email', () => {
            const result = UserSchema.safeParse({ ...validUser, email: 'invalid-email' });
            expect(result.success).toBe(false);
        });

        it('should fail on short name', () => {
            const result = UserSchema.safeParse({ ...validUser, name: 'J' });
            expect(result.success).toBe(false);
        });

        it('should fail on invalid phone number', () => {
            const result = UserSchema.safeParse({ ...validUser, phone: 'abc' });
            expect(result.success).toBe(false);
        });

        it('should validate user with optional fields missing', () => {
            const result = UserSchema.safeParse({ id: '1', name: 'John Doe' });
            expect(result.success).toBe(true);
        });
    });

    describe('MedicationSchema', () => {
        const validMed = {
            id: '1',
            name: 'Aspirin',
            dosage: '100mg',
            frequency: 'Daily',
            schedule: '08:00',
            status: 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        it('should validate a correct medication object', () => {
            const result = MedicationSchema.safeParse(validMed);
            expect(result.success).toBe(true);
        });

        it('should fail if required fields are missing', () => {
            const { name, ...invalidMed } = validMed;
            const result = MedicationSchema.safeParse(invalidMed);
            expect(result.success).toBe(false);
        });

        it('should fail with invalid status', () => {
            const result = MedicationSchema.safeParse({ ...validMed, status: 'Invalid' });
            expect(result.success).toBe(false);
        });

        it('should fail with invalid datetime', () => {
            const result = MedicationSchema.safeParse({ ...validMed, createdAt: 'not-a-date' });
            expect(result.success).toBe(false);
        });
    });

    describe('OCRResultSchema', () => {
        it('should validate a correct OCR result', () => {
            const result = OCRResultSchema.safeParse({
                text: 'Raw text',
                confidence: 0.95,
                medicationName: 'Advil',
            });
            expect(result.success).toBe(true);
        });

        it('should fail if confidence is out of range', () => {
            const result = OCRResultSchema.safeParse({
                text: 'text',
                confidence: 1.5,
            });
            expect(result.success).toBe(false);
        });
    });
});
