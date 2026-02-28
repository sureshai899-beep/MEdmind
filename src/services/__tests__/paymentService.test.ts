import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentService, SUBSCRIPTION_PLANS } from '../paymentService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('paymentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        // Mock Math.random to always succeed (isSuccess = true if > 0.05)
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    describe('processPayment', () => {
        it('should successfully process payment for a valid plan', async () => {
            const planId = 'premium_monthly';
            const promise = paymentService.processPayment(planId);

            // Advance timers to trigger the delay
            jest.advanceTimersByTime(2000);

            const result = await promise;

            expect(result.success).toBe(true);
            expect(result.transactionId).toBeDefined();
            expect(result.transactionId).toMatch(/^txn_/);
            expect(AsyncStorage.setItem).toHaveBeenCalled();
        });

        it('should return error when payment fails', async () => {
            // Mock Math.random to fail (isSuccess = false if <= 0.05)
            jest.spyOn(Math, 'random').mockReturnValue(0.01);

            const planId = 'premium_monthly';
            const promise = paymentService.processPayment(planId);

            jest.advanceTimersByTime(2000);

            const result = await promise;

            expect(result.success).toBe(false);
            expect(result.error).toBe('Payment gateway timeout. Please try again.');
        });

        it('should use correct price in transaction history', async () => {
            const planId = 'premium_annual';
            const expectedPrice = SUBSCRIPTION_PLANS.find(p => p.id === planId)?.price;

            const promise = paymentService.processPayment(planId);
            jest.advanceTimersByTime(2000);
            await promise;

            const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
            const savedData = JSON.parse(setItemCall[1]);
            expect(savedData[0].amount).toBe(expectedPrice);
        });
    });

    describe('getHistory', () => {
        it('should return parsed history from storage', async () => {
            const mockHistory = [{ transactionId: 'txn_1', planId: 'free' }];
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockHistory));

            const history = await paymentService.getHistory();

            expect(history).toEqual(mockHistory);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pillara_payment_history');
        });

        it('should return empty array if storage is empty', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            const history = await paymentService.getHistory();

            expect(history).toEqual([]);
        });

        it('should handle JSON parsing error', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

            const history = await paymentService.getHistory();

            expect(history).toEqual([]);
        });
    });

    describe('saveTransaction', () => {
        it('should append new transaction to existing history', async () => {
            const existingHistory = [{ transactionId: 'txn_old' }];
            const newTransaction = { transactionId: 'txn_new' };
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingHistory));

            await paymentService.saveTransaction(newTransaction);

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@pillara_payment_history',
                JSON.stringify([newTransaction, ...existingHistory])
            );
        });
    });
});
