// Mock expo-modules-core/src/Refs before jest-expo setup tries to load it
jest.mock('expo-modules-core/src/Refs', () => ({
    createSnapshotFriendlyRef: () => {
        const ref = { current: null };
        Object.defineProperty(ref, 'toJSON', {
            value: () => '[React.ref]',
        });
        return ref;
    },
}));
