import { NextFunction, Request, Response } from 'express'
import { CalculationService } from '../../services/public/CalculationService'
import { ResponseCodes } from '../../utils/constants';

class CalculationController {
    static dataCalculation = async (req: Request, res: Response, next: NextFunction) => {
        const result = await CalculationService.dataCalculation(req)

        res.send({
            status: ResponseCodes.CALCULATION_RESULT.code,
            message: ResponseCodes.CALCULATION_RESULT.message,
            data: result
        });
    }
}

export default CalculationController