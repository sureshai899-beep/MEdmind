import { drugSafetyService } from '../drugSafetyService';
import { API } from '../apiClient';

jest.mock('../apiClient', () => ({
    API: {
        drugs: {
            interactions: jest.fn(),
        },
    },
}));

describe('drugSafetyService', () => {
    const mockMeds = [
        { id: '1', name: 'Lisinopril', dosage: '10mg' },
        { id: '2', name: 'Aspirin', dosage: '81mg' },
    ] as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkInteractions', () => {
        it('should call API and return results if successful', async () => {
            const apiResult = [{ id: 'api-1', description: 'API Warning', severity: 'High', affectedDrugs: [] }];
            (API.drugs.interactions as jest.Mock).mockResolvedValue(apiResult);

            const result = await drugSafetyService.checkInteractions(mockMeds);
            expect(result).toEqual(apiResult);
        });

        it('should fallback to mock interactions on API failure', async () => {
            (API.drugs.interactions as jest.Mock).mockRejectedValue(new Error('API Down'));

            const result = await drugSafetyService.checkInteractions(mockMeds);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].description).toContain('kidney problems');
        });
    });

    describe('getMockInteractions', () => {
        it('should detect Warfarin and Ibuprofen interaction', () => {
            const result = drugSafetyService.getMockInteractions(['Warfarin', 'Ibuprofen']);
            expect(result.some(i => i.severity === 'High' && i.description.includes('bleeding'))).toBe(true);
        });

        it('should detect Sildenafil and Nitrates interaction', () => {
            const result = drugSafetyService.getMockInteractions(['Sildenafil', 'Nitroglycerin']);
            expect(result.some(i => i.severity === 'High' && i.description.includes('blood pressure'))).toBe(true);
        });

        it('should detect Metformin and Alcohol interaction', () => {
            const result = drugSafetyService.getMockInteractions(['Metformin', 'Alcohol']);
            expect(result.some(i => i.severity === 'Moderate' && i.description.includes('lactic acidosis'))).toBe(true);
        });

        it('should return empty if no interactions found', () => {
            const result = drugSafetyService.getMockInteractions(['Vitamin C', 'B12']);
            expect(result).toEqual([]);
        });
    });
});
