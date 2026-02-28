import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: '₹0',
        description: 'Basic medication tracking',
        features: [
            'Basic medication tracking',
            'Daily reminders',
            'Manual entry',
        ]
    },
    {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: '₹199',
        description: 'Complete health companion',
        features: [
            'Unlimited AI Scanning',
            'Interaction checker',
            'Blood group & Allergies tracking',
            'Refill alerts',
            'Priority support',
        ],
        isPopular: true
    },
    {
        id: 'premium_annual',
        name: 'Premium Annual',
        price: '₹1,599',
        description: 'Best value for long-term health',
        features: [
            'Everything in Monthly',
            'Cloud backup',
            'Dose history exports (PDF/CSV)',
            'Caregiver sharing',
        ]
    }
];

const PAYMENT_HISTORY_KEY = '@pillara_payment_history';

export const paymentService = {
    /**
     * Simulate a payment process
     */
    async processPayment(planId: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
        console.log(`Processing payment for plan: ${planId}...`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (95% chance)
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
            const transactionId = `txn_${Date.now()}`;
            await this.saveTransaction({
                planId,
                transactionId,
                timestamp: new Date().toISOString(),
                amount: SUBSCRIPTION_PLANS.find(p => p.id === planId)?.price || '0'
            });
            return { success: true, transactionId };
        } else {
            return { success: false, error: 'Payment gateway timeout. Please try again.' };
        }
    },

    /**
     * Save transaction history
     */
    async saveTransaction(transaction: any) {
        try {
            const history = await this.getHistory();
            const updated = [transaction, ...history];
            await AsyncStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save transaction history', e);
        }
    },

    /**
     * Get transaction history
     */
    async getHistory(): Promise<any[]> {
        try {
            const stored = await AsyncStorage.getItem(PAYMENT_HISTORY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to get transaction history', e);
            return [];
        }
    }
};
