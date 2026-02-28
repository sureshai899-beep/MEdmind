import { drugDatabaseService } from '../drugDatabaseService';
import { apiClient } from '../apiClient';

jest.mock('../apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe('drugDatabaseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchMedications', () => {
        it('should return empty array if query is too short', async () => {
            const results = await drugDatabaseService.searchMedications('a');
            expect(results).toEqual([]);
            expect(apiClient.get).not.toHaveBeenCalled();
        });

        it('should call API with encoded query', async () => {
            const mockResults = [{ id: '1', name: 'Drug A', dosageForms: [], commonDosages: [] }];
            (apiClient.get as jest.Mock).mockResolvedValue(mockResults);

            const result = await drugDatabaseService.searchMedications('abc');
            expect(result).toEqual(mockResults);
            expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('q=abc'));
        });

        it('should fallback to mock data on API failure', async () => {
            (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));
            const result = await drugDatabaseService.searchMedications('lisinopril');
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].name.toLowerCase()).toContain('lisinopril');
        });
    });

    describe('getMedicationDetails', () => {
        it('should return drug details on success', async () => {
            const mockDrug = { id: '123', name: 'Test Drug' };
            (apiClient.get as jest.Mock).mockResolvedValue(mockDrug);

            const result = await drugDatabaseService.getMedicationDetails('123');
            expect(result).toEqual(mockDrug);
        });

        it('should return null on failure', async () => {
            (apiClient.get as jest.Mock).mockRejectedValue(new Error('Not found'));
            const result = await drugDatabaseService.getMedicationDetails('123');
            expect(result).toBeNull();
        });
    });

    describe('checkInteractions', () => {
        it('should return empty array if less than 2 drugs provided', async () => {
            const result = await drugDatabaseService.checkInteractions(['1']);
            expect(result).toEqual([]);
        });

        it('should call API for interaction check', async () => {
            const mockInt = [{ id: 'int-1', drug1: 'A', drug2: 'B', severity: 'major' }];
            (apiClient.post as jest.Mock).mockResolvedValue(mockInt);

            const result = await drugDatabaseService.checkInteractions(['1', '2']);
            expect(result).toEqual(mockInt);
            expect(apiClient.post).toHaveBeenCalledWith('/drugs/interactions', { drugIds: ['1', '2'] });
        });
    });
});
