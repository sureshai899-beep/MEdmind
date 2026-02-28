import { apiClient } from './apiClient';

/**
 * Drug Interaction Severity
 */
export type InteractionSeverity = 'minor' | 'moderate' | 'major' | 'severe';

/**
 * Drug Interaction Interface
 */
export interface DrugInteraction {
    id: string;
    drug1: string;
    drug2: string;
    severity: InteractionSeverity;
    description: string;
    recommendation: string;
}

/**
 * Medication Search Result
 */
export interface MedicationSearchResult {
    id: string;
    name: string;
    genericName?: string;
    brandNames?: string[];
    dosageForms: string[];
    commonDosages: string[];
    category?: string;
}

const OPENFDA_API_URL = 'https://api.fda.gov/drug/label.json';

/**
 * Drug Database Service using OpenFDA API
 */
class DrugDatabaseService {
    /**
     * Search medications by name using OpenFDA
     */
    async searchMedications(query: string): Promise<MedicationSearchResult[]> {
        try {
            if (query.length < 2) return [];

            const response = await fetch(
                `${OPENFDA_API_URL}?search=openfda.brand_name:"${query}"+openfda.generic_name:"${query}"&limit=10`
            );
            const data = await response.json();

            if (!data.results) return [];

            return data.results.map((item: any) => ({
                id: item.id || Math.random().toString(),
                name: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || 'Unknown',
                genericName: item.openfda?.generic_name?.[0],
                brandNames: item.openfda?.brand_name,
                dosageForms: item.openfda?.route || [],
                commonDosages: [],
                category: item.openfda?.pharm_class_cs?.[0],
            }));
        } catch (error) {
            console.error('OpenFDA search failed:', error);
            return this.mockSearchMedications(query);
        }
    }

    /**
     * Get medication details by ID from OpenFDA
     */
    async getMedicationDetails(drugId: string): Promise<MedicationSearchResult | null> {
        try {
            const response = await fetch(`${OPENFDA_API_URL}?search=id:${drugId}`);
            const data = await response.json();
            const item = data.results?.[0];

            if (!item) return null;

            return {
                id: item.id,
                name: item.openfda?.brand_name?.[0] || 'Unknown',
                genericName: item.openfda?.generic_name?.[0],
                brandNames: item.openfda?.brand_name,
                dosageForms: item.openfda?.route || [],
                commonDosages: [],
                category: item.openfda?.pharm_class_cs?.[0],
            };
        } catch (error) {
            console.error('Failed to get medication details:', error);
            return null;
        }
    }

    /**
     * Check drug interactions
     */
    async checkInteractions(medicationIds: string[]): Promise<DrugInteraction[]> {
        try {
            if (medicationIds.length < 2) return [];

            const interactions = await apiClient.post<DrugInteraction[]>(
                '/drugs/interactions',
                { drugIds: medicationIds }
            );

            return interactions;
        } catch (error) {
            console.error('Drug interaction check failed:', error);

            // Fallback to mock data
            return this.mockCheckInteractions(medicationIds);
        }
    }

    /**
     * Check interactions by medication names
     */
    async checkInteractionsByNames(medicationNames: string[]): Promise<DrugInteraction[]> {
        try {
            if (medicationNames.length < 2) return [];

            const interactions = await apiClient.post<DrugInteraction[]>(
                '/drugs/interactions/by-name',
                { medications: medicationNames }
            );

            return interactions;
        } catch (error) {
            console.error('Drug interaction check failed:', error);
            return this.mockCheckInteractionsByNames(medicationNames);
        }
    }

    /**
     * Mock medication search for development
     */
    private mockSearchMedications(query: string): MedicationSearchResult[] {
        const mockDatabase: MedicationSearchResult[] = [
            {
                id: '1',
                name: 'Lisinopril',
                genericName: 'Lisinopril',
                brandNames: ['Prinivil', 'Zestril'],
                dosageForms: ['Tablet'],
                commonDosages: ['2.5mg', '5mg', '10mg', '20mg', '40mg'],
                category: 'ACE Inhibitor',
            },
            {
                id: '2',
                name: 'Metformin',
                genericName: 'Metformin',
                brandNames: ['Glucophage', 'Fortamet'],
                dosageForms: ['Tablet', 'Extended-Release Tablet'],
                commonDosages: ['500mg', '850mg', '1000mg'],
                category: 'Antidiabetic',
            },
            {
                id: '3',
                name: 'Atorvastatin',
                genericName: 'Atorvastatin',
                brandNames: ['Lipitor'],
                dosageForms: ['Tablet'],
                commonDosages: ['10mg', '20mg', '40mg', '80mg'],
                category: 'Statin',
            },
            {
                id: '4',
                name: 'Aspirin',
                genericName: 'Acetylsalicylic Acid',
                brandNames: ['Bayer', 'Ecotrin'],
                dosageForms: ['Tablet', 'Chewable Tablet'],
                commonDosages: ['81mg', '325mg'],
                category: 'Antiplatelet',
            },
        ];

        const lowerQuery = query.toLowerCase();
        return mockDatabase.filter(drug =>
            drug.name.toLowerCase().includes(lowerQuery) ||
            drug.genericName?.toLowerCase().includes(lowerQuery) ||
            drug.brandNames?.some(brand => brand.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Mock drug interaction check
     */
    private mockCheckInteractions(medicationIds: string[]): DrugInteraction[] {
        // Mock interactions for demonstration
        if (medicationIds.includes('1') && medicationIds.includes('4')) {
            return [
                {
                    id: 'int-1',
                    drug1: 'Lisinopril',
                    drug2: 'Aspirin',
                    severity: 'moderate',
                    description: 'Aspirin may reduce the effectiveness of Lisinopril in lowering blood pressure.',
                    recommendation: 'Monitor blood pressure regularly. Consult your doctor if you notice changes.',
                },
            ];
        }

        return [];
    }

    /**
     * Mock interaction check by names
     */
    private mockCheckInteractionsByNames(medicationNames: string[]): DrugInteraction[] {
        const interactions: DrugInteraction[] = [];

        // Check for common interactions
        const hasWarfarin = medicationNames.some(name => name.toLowerCase().includes('warfarin'));
        const hasAspirin = medicationNames.some(name => name.toLowerCase().includes('aspirin'));
        const hasIbuprofen = medicationNames.some(name => name.toLowerCase().includes('ibuprofen'));

        if (hasWarfarin && (hasAspirin || hasIbuprofen)) {
            interactions.push({
                id: 'int-warfarin',
                drug1: 'Warfarin',
                drug2: hasAspirin ? 'Aspirin' : 'Ibuprofen',
                severity: 'major',
                description: 'Increased risk of bleeding when taken together.',
                recommendation: 'Avoid combination. Consult your doctor immediately if you experience unusual bleeding or bruising.',
            });
        }

        return interactions;
    }
}

export const drugDatabaseService = new DrugDatabaseService();
export default drugDatabaseService;
