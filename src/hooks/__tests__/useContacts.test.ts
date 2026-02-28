import { renderHook, act } from '@testing-library/react-native';
import { useContacts } from '../useContacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('useContacts', () => {
    const mockContacts = [
        {
            id: '1',
            name: 'Dr. Smith',
            type: 'doctor',
            phone: '1234567890',
            createdAt: '2026-01-01T00:00:00.000Z',
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load contacts on mount', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockContacts));

        const { result } = renderHook(() => useContacts());

        // Initial state should be loading
        expect(result.current.loading).toBe(true);

        // Wait for useEffect
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.contacts).toEqual(mockContacts);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pillara_contacts');
    });

    it('should add a new contact', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

        const { result } = renderHook(() => useContacts());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const newContact = {
            name: 'New Doctor',
            type: 'doctor' as const,
            phone: '0987654321',
        };

        let addedContact;
        await act(async () => {
            addedContact = await result.current.addContact(newContact);
        });

        expect(result.current.contacts).toHaveLength(1);
        expect(result.current.contacts[0].name).toBe('New Doctor');
        expect(result.current.contacts[0].id).toBeDefined();
        expect(AsyncStorage.setItem).toHaveBeenCalled();
        expect(addedContact).toEqual(result.current.contacts[0]);
    });

    it('should update an existing contact', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockContacts));

        const { result } = renderHook(() => useContacts());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        await act(async () => {
            await result.current.updateContact('1', { name: 'Dr. Updated' });
        });

        expect(result.current.contacts[0].name).toBe('Dr. Updated');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            '@pillara_contacts',
            expect.stringContaining('Dr. Updated')
        );
    });

    it('should delete a contact', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockContacts));

        const { result } = renderHook(() => useContacts());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        await act(async () => {
            await result.current.deleteContact('1');
        });

        expect(result.current.contacts).toHaveLength(0);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pillara_contacts', '[]');
    });

    it('should handle errors when loading contacts', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Load error'));

        const { result } = renderHook(() => useContacts());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith('Error loading contacts:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});
