import { Router } from 'express';
import { registerWithPrisma, loginWithPrisma, googleLogin, refreshToken, verifyOTPAndAuthenticate } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import prisma from '../db/prisma.js';
import { otpService } from '../services/otp.service.js';

const router = Router();

router.post('/register', validate(registerSchema), registerWithPrisma(prisma));
router.post('/login', validate(loginSchema), loginWithPrisma(prisma));

// Social Login
router.post('/google', googleLogin(prisma));

// Real OTP flow
router.post('/phone/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    const result = await otpService.sendOTP(phoneNumber);
    res.status(result.success ? 200 : 400).json(result);
});

router.post('/phone/verify', async (req, res, next) => {
    const { phoneNumber, code } = req.body;
    const result = await otpService.verifyOTP(phoneNumber, code);

    if (result.verified) {
        return verifyOTPAndAuthenticate(prisma)(req, res, next);
    } else {
        res.status(401).json({ status: 'fail', message: 'Invalid OTP' });
    }
});

router.post('/logout', (req, res) => res.status(200).json({ status: 'success' }));
router.post('/refresh', refreshToken);

export default router;


