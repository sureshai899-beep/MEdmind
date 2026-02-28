import { API } from './apiClient';
import { Medication } from '../utils/schemas';

export interface DrugInteraction {
    id: string;
    severity: 'High' | 'Moderate' | 'Minor';
    description: string;
    affectedDrugs: string[];
}

export const drugSafetyService = {
    /**
     * Check for interactions between a list of medications
     */
    async checkInteractions(medications: Medication[]): Promise<DrugInteraction[]> {
        const drugNames = medications.map(m => m.name);

        try {
            // In a real app, this would call the API
            const result = await API.drugs.interactions(medications.map(m => m.id));
            if (result && Array.isArray(result)) return result;

            // Mock interactions for demonstration
            return this.getMockInteractions(drugNames);
        } catch (error) {
            console.error('Failed to check interactions:', error);
            // Fallback to local mock heuristics
            return this.getMockInteractions(drugNames);
        }
    },

    /**
     * Simple heuristic mock interactions
     */
    getMockInteractions(drugNames: string[]): DrugInteraction[] {
        const interactions: DrugInteraction[] = [];
        const names = drugNames.map(n => n.toLowerCase());

        // DRUG-DRUG INTERACTIONS

        // Lisinopril and High Dose Aspirin
        if (names.some(n => n.includes('lisinopril')) && names.some(n => n.includes('aspirin'))) {
            interactions.push({
                id: 'int_1',
                severity: 'Moderate',
                description: 'Taking Lisinopril with Aspirin may reduce the effects of Lisinopril and increase the risk of kidney problems.',
                affectedDrugs: ['Lisinopril', 'Aspirin']
            });
        }

        // Warfarin and Ibuprofen
        if (names.some(n => n.includes('warfarin')) && names.some(n => n.includes('ibuprofen'))) {
            interactions.push({
                id: 'int_2',
                severity: 'High',
                description: 'Combining Warfarin with Ibuprofen significantly increases the risk of bleeding.',
                affectedDrugs: ['Warfarin', 'Ibuprofen']
            });
        }

        // Simvastatin and Amiodarone
        if (names.some(n => n.includes('simvastatin')) && names.some(n => n.includes('amiodarone'))) {
            interactions.push({
                id: 'int_3',
                severity: 'High',
                description: 'Amiodarone can increase simvastatin levels, increasing risk of muscle damage (rhabdomyolysis).',
                affectedDrugs: ['Simvastatin', 'Amiodarone']
            });
        }

        // Sildenafil and Nitrates (e.g., Nitroglycerin)
        if (names.some(n => n.includes('sildenafil')) && names.some(n => n.includes('nitro'))) {
            interactions.push({
                id: 'int_4',
                severity: 'High',
                description: 'Sildenafil taken with nitrates can cause a dangerous drop in blood pressure.',
                affectedDrugs: ['Sildenafil', 'Nitroglycerin']
            });
        }

        // DRUG-FOOD/LIFESTYLE INTERACTIONS

        // Statins and Grapefruit
        if (names.some(n => n.includes('simvastatin') || n.includes('atorvastatin') || n.includes('lovastatin'))) {
            interactions.push({
                id: 'int_food_1',
                severity: 'Moderate',
                description: 'Grapefruit juice can block enzymes that break down certain statins, leading to higher levels in the body.',
                affectedDrugs: ['Statins', 'Grapefruit Juice']
            });
        }

        // Metformin and Alcohol
        if (names.some(n => n.includes('metformin'))) {
            interactions.push({
                id: 'int_alc_1',
                severity: 'Moderate',
                description: 'Drinking alcohol with metformin can increase the risk of lactic acidosis, a serious condition.',
                affectedDrugs: ['Metformin', 'Alcohol']
            });
        }

        // Levothyroxine and Calcium/Iron
        if (names.some(n => n.includes('levothyroxine'))) {
            interactions.push({
                id: 'int_food_2',
                severity: 'Minor',
                description: 'Calcium or iron supplements can interfere with the absorption of thyroid medication.',
                affectedDrugs: ['Levothyroxine', 'Calcium/Iron Supplements']
            });
        }

        return interactions;
    }
};
