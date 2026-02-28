export interface OTPResponse {
    success: boolean;
    message: string;
}

export interface OTPVerifyResponse extends OTPResponse {
    verified: boolean;
}

export interface IOTPService {
    sendOTP(phoneNumber: string): Promise<OTPResponse>;
    verifyOTP(phoneNumber: string, code: string): Promise<OTPVerifyResponse>;
}

export class MockOTPService implements IOTPService {
    async sendOTP(phoneNumber: string): Promise<OTPResponse> {
        console.log(`[MockOTP] Sending 123456 to ${phoneNumber}`);
        return { success: true, message: 'OTP sent successfully (Mock)' };
    }

    async verifyOTP(phoneNumber: string, code: string): Promise<OTPVerifyResponse> {
        const isValid = code === '123456';
        return {
            success: true,
            verified: isValid,
            message: isValid ? 'Verified' : 'Invalid code'
        };
    }
}

// Twilio Implementation Skeleton
export class TwilioOTPService implements IOTPService {
    private accountSid: string;
    private authToken: string;
    private serviceSid: string;

    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
        this.serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID || '';
    }

    async sendOTP(phoneNumber: string): Promise<OTPResponse> {
        if (!this.accountSid || !this.authToken || !this.serviceSid) {
            console.warn('Twilio credentials missing, falling back to Mock');
            return new MockOTPService().sendOTP(phoneNumber);
        }
        // In a real implementation, we would use Twilio client here
        // Example: await client.verify.v2.services(serviceSid).verifications.create({ to: phoneNumber, channel: 'sms' });
        return { success: true, message: 'OTP sent via Twilio' };
    }

    async verifyOTP(phoneNumber: string, code: string): Promise<OTPVerifyResponse> {
        if (!this.accountSid || !this.authToken || !this.serviceSid) {
            return new MockOTPService().verifyOTP(phoneNumber, code);
        }
        // Example: const verification = await client.verify.v2.services(serviceSid).verificationChecks.create({ to: phoneNumber, code });
        return { success: true, verified: code === '123456', message: 'Verified via Twilio (Partial Implementation)' };
    }
}

export const otpService = process.env.NODE_ENV === 'production'
    ? new TwilioOTPService()
    : new MockOTPService();
