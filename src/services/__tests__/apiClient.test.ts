import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { captureException, addBreadcrumb } from '../sentry';

// -----------------------------------------------------------------------
// Mocks — must be declared BEFORE importing the singleton apiClient,
// because jest.mock() is hoisted but variable initialisers are NOT.
// We capture the instance via a lazy getter so we avoid the TDZ issue.
// -----------------------------------------------------------------------

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('../sentry', () => ({
    captureException: jest.fn(),
    addBreadcrumb: jest.fn(),
}));

// Build the instance object inside the factory so it is created before any
// module code runs.  We expose it on the mock module itself so tests can
// reach it without triggering TS-zone errors.
jest.mock('axios', () => {
    const instance = {
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        defaults: { headers: { common: {} } },
    };

    const axiosMock: any = {
        create: jest.fn(() => instance),
        __instance: instance,         // exposed for tests
    };
    return axiosMock;
});

// Import after mocks so the singleton is built against the fakes.
import { apiClient, API } from '../apiClient';

// Helper – grab the instance the ApiClient constructor received.
function getInstance() {
    return (axios as any).__instance;
}

// -----------------------------------------------------------------------

describe('ApiClient', () => {
    // Capture the interceptor handlers registered at module load, BEFORE
    // beforeEach can clear them via jest.clearAllMocks().
    let requestInterceptorFulfilled: (cfg: any) => any;
    let responseInterceptorFulfilled: (res: any) => any;
    let responseInterceptorRejected: (err: any) => any;

    beforeAll(() => {
        const [[rqOnFulfilled]] = (getInstance().interceptors.request.use as jest.Mock).mock.calls;
        const [[rsOnFulfilled, rsOnRejected]] = (getInstance().interceptors.response.use as jest.Mock).mock.calls;
        requestInterceptorFulfilled = rqOnFulfilled;
        responseInterceptorFulfilled = rsOnFulfilled;
        responseInterceptorRejected = rsOnRejected;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── constructor ────────────────────────────────────────────────────
    it('initialises axios with create() and registers interceptors', () => {
        // `getInstance()` exposes the fake instance that ApiClient received.
        // Verify it has the expected shape.
        const inst = getInstance();
        expect(inst.interceptors.request.use).toBeDefined();
        expect(inst.interceptors.response.use).toBeDefined();
    });

    // ── setToken ───────────────────────────────────────────────────────
    it('stores the token via SecureStore when a non-null value is passed', async () => {
        await apiClient.setToken('abc123');
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@pillara_token', 'abc123');
    });

    it('deletes the token via SecureStore when null is passed', async () => {
        await apiClient.setToken(null);
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_token');
    });

    // ── HTTP methods ───────────────────────────────────────────────────
    it('GET request returns response.data', async () => {
        getInstance().get.mockResolvedValue({ data: { ok: true } });
        const result = await apiClient.get('/ping');
        expect(getInstance().get).toHaveBeenCalledWith('/ping', undefined);
        expect(result).toEqual({ ok: true });
    });

    it('POST request returns response.data', async () => {
        getInstance().post.mockResolvedValue({ data: { created: true } });
        const result = await apiClient.post('/items', { name: 'x' });
        expect(getInstance().post).toHaveBeenCalledWith('/items', { name: 'x' }, undefined);
        expect(result).toEqual({ created: true });
    });

    it('PUT request returns response.data', async () => {
        getInstance().put.mockResolvedValue({ data: { updated: true } });
        const result = await apiClient.put('/items/1', { name: 'y' });
        expect(result).toEqual({ updated: true });
    });

    it('DELETE request returns response.data', async () => {
        getInstance().delete.mockResolvedValue({ data: { deleted: true } });
        const result = await apiClient.delete('/items/1');
        expect(result).toEqual({ deleted: true });
    });

    // ── API endpoint helpers ───────────────────────────────────────────
    it('exposes the expected top-level API namespaces', () => {
        expect(typeof API.auth.loginGoogle).toBe('function');
        expect(typeof API.medications.list).toBe('function');
        expect(typeof API.doses.log).toBe('function');
        expect(typeof API.profile.get).toBe('function');
        expect(typeof API.drugs.search).toBe('function');
    });

    // ── request interceptor ────────────────────────────────────────────
    it('request interceptor attaches Bearer token when token is set', async () => {
        await apiClient.setToken('my-token');

        const config = { headers: {}, method: 'get', url: '/test' };
        const result = await requestInterceptorFulfilled(config);

        expect(result.headers.Authorization).toBe('Bearer my-token');
        expect(addBreadcrumb).toHaveBeenCalled();
    });

    // ── response interceptor ───────────────────────────────────────────
    it('response interceptor passes through successful responses', () => {
        const mockResponse = { status: 200, config: { url: '/test' }, data: {} };

        const result = responseInterceptorFulfilled(mockResponse);
        expect(result).toBe(mockResponse);
        expect(addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('200') }));
    });

    it('response interceptor clears the token on 401 and re-throws', async () => {
        const error = { response: { status: 401 }, config: { url: '/test' }, message: 'Unauthorized' };

        await expect(responseInterceptorRejected(error)).rejects.toEqual(error);
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@pillara_token');
        expect(captureException).toHaveBeenCalled();
    });
});
