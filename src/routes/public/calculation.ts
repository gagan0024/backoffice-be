import { Router } from 'express';
import CalculationController from '../../controllers/public/CalculationController';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();

// Data calculation
router.post('/calculations', asyncHandler(CalculationController.dataCalculation));

export default router;
