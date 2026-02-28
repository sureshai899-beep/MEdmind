import { z } from 'zod';

/**
 * User Schema
 */
export const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
    profilePictureUrl: z.string().url().optional(),
    age: z.number().min(0).max(120).optional(),
    // Health profile fields
    weight: z.number().min(0).max(500).optional(),
    weightUnit: z.enum(['kg', 'lbs']).default('kg').optional(),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Medication Schema
 */
export const MedicationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    purpose: z.string().optional(),
    schedule: z.string(),
    nextDose: z.string().optional(),
    nextDoseTime: z.string().optional(),
    icon: z.string().optional(),
    iconBg: z.string().optional(),
    status: z.enum(['Active', 'Paused', 'Completed']),
    // Refill management fields
    pillCount: z.number().min(0).optional(),
    lowStockThreshold: z.number().min(1).default(7).optional(),
    refillReminder: z.boolean().default(true).optional(),
    // Additional metadata
    sideEffects: z.array(z.string()).optional(),
    storageInstructions: z.string().optional(),
    contraindications: z.array(z.string()).optional(),
    pillImageUri: z.string().url().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type Medication = z.infer<typeof MedicationSchema>;

/**
 * OCR Result Schema
 */
export const OCRResultSchema = z.object({
    text: z.string(),
    confidence: z.number().min(0).max(1),
    medicationName: z.string().optional(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
});

export type OCRResult = z.infer<typeof OCRResultSchema>;

/**
 * Offline Action Schema
 */
export const OfflineActionSchema = z.object({
    id: z.string(),
    type: z.enum(['ADD_MEDICATION', 'UPDATE_MEDICATION', 'DELETE_MEDICATION', 'LOG_DOSE']),
    payload: z.any(),
    timestamp: z.number(),
});

export type OfflineAction = z.infer<typeof OfflineActionSchema>;
