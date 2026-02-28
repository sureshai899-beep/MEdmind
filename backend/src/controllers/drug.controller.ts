import type { Request, Response, NextFunction } from 'express';
import { drugService } from '../services/drug.service.js';

export const searchDrugs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        const results = await drugService.searchDrugs(query);

        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (error) {
        next(error);
    }
};



export const getDrugDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const medication = await drugService.getDrugDetails(id);

        res.status(200).json({
            status: 'success',
            data: medication
        });
    } catch (error) {
        next(error);
    }
};

export const checkInteractions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { drugIds } = req.body;
        const interactions = await drugService.checkInteractions(drugIds);

        res.status(200).json({
            status: 'success',
            data: interactions
        });
    } catch (error) {
        next(error);
    }
};
