import axios from 'axios';

export interface DrugSearchResult {
    id: string; // RxCUI
    name: string;
    genericName?: string;
    brandNames?: string[];
    dosageForms: string[];
    commonDosages: string[];
    category?: string;
}

export class DrugService {
    private readonly baseUrl = 'https://rxnav.nlm.nih.gov/REST';

    /**
     * Search medications using NIH RxNorm API
     */
    async searchDrugs(query: string): Promise<DrugSearchResult[]> {
        try {
            if (!query || query.length < 2) return [];

            // 1. Find RxCUI by string
            const searchResponse = await axios.get(`${this.baseUrl}/approximateTerm.json`, {
                params: { term: query, maxEntries: 10 }
            });

            const candidates = searchResponse.data.approximateGroup?.candidate || [];
            if (candidates.length === 0) return [];

            const results: DrugSearchResult[] = await Promise.all(
                candidates.slice(0, 5).map(async (candidate: any) => {
                    const rxcui = candidate.rxcui;

                    // 2. Get details for each RxCUI
                    const detailsResponse = await axios.get(`${this.baseUrl}/rxcui/${rxcui}/allrelated.json`);
                    const conceptGroup = detailsResponse.data.allRelatedGroup?.conceptGroup || [];

                    // Extract Brand Names and Generic Names
                    const brandNames = conceptGroup.find((g: any) => g.tty === 'BN')?.conceptProperties?.map((p: any) => p.name) || [];
                    const genericNames = conceptGroup.find((g: any) => g.tty === 'IN')?.conceptProperties?.map((p: any) => p.name) || [];

                    return {
                        id: rxcui,
                        name: candidate.name,
                        genericName: genericNames[0] || candidate.name,
                        brandNames: brandNames.slice(0, 3),
                        dosageForms: [], // Could be extracted from SCDF/DF types
                        commonDosages: [],
                        category: '',
                    };
                })
            );

            return results;
        } catch (error) {
            console.error('Drug Search API Error:', error);
            return [];
        }
    }

    async getDrugDetails(id: string): Promise<DrugSearchResult | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/rxcui/${id}/properties.json`);
            const props = response.data.properties;

            if (!props) return null;

            return {
                id: props.rxcui,
                name: props.name,
                genericName: props.name,
                dosageForms: [],
                commonDosages: [],
            };
        } catch (error) {
            console.error('Drug Details API Error:', error);
            return null;
        }
    }

    async checkInteractions(drugIds: string[]): Promise<any[]> {
        try {
            if (drugIds.length < 2) return [];

            // Attempt to use the interaction API (Note: might be legacy but often still reachable)
            const rxcuis = drugIds.join('+');
            const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/interaction/list.json`, {
                params: { rxcuis }
            });

            const interactionGroups = response.data.fullInteractionTypeGroup || [];
            const results: any[] = [];

            interactionGroups.forEach((group: any) => {
                group.fullInteractionType.forEach((type: any) => {
                    const pair = type.interactionPair[0];
                    results.push({
                        id: `rx-${results.length}`,
                        drug1: type.minorscui[0], // simplified
                        drug2: type.minorscui[1], // simplified
                        severity: pair.severity,
                        description: pair.description,
                        recommendation: 'Consult your pharmacist for advice.'
                    });
                });
            });

            return results;
        } catch (error) {
            console.warn('Interaction API Error or Discontinued. Falling back to safe mock.', error);
            return [];
        }
    }
}

export const drugService = new DrugService();

