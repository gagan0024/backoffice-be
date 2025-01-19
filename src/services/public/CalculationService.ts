import { Request } from 'express'
import { Action } from '../../models/action'
import { ventilationCalculation } from '../../utils/helper'
import { NotFoundError } from '../../exceptions/notFoundError'
import { CustomError } from '../../exceptions/customError'

export class CalculationService {
    static dataCalculation = async (req: Request) => {
        const {
            location_id,
            building_id,
            sub_building_id,
            level_id,
            room_id,
            action_id,
            area,
            height
        } = req.body

        try {
            const actionDetails = await Action.findOne({ _id: action_id })

            if (!actionDetails) {
                throw new NotFoundError(`Action details not found`);
            }

            switch (actionDetails?.name) {
                case "Ventilation Calculation":
                    return await ventilationCalculation(
                        location_id,
                        building_id,
                        sub_building_id,
                        level_id,
                        room_id,
                        action_id,
                        parseInt(area),
                        parseInt(height)
                    )
                default:
                    throw new NotFoundError(`Action details not found`);
            }
        } catch (error) {
            console.log(error)
            throw new CustomError(`Action details not found`);
        }
    }
}