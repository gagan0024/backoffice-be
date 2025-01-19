import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { BuildingCalculation, IBuildingCalculation } from '../../models/building-calculation';
import { SubBuildingCalculation, ISubBuildingCalculation } from '../../models/sub-building-calculation';
import { LevelCalculation, ILevelCalculation } from '../../models/level-calculation';
import { RoomCalculation, IRoomCalculation } from '../../models/room-calculation';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class FinalDesignController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const {
            location_id,
            building_id,
            sub_building_id,
            level_id,
            room_id,
            service_id,
            sub_service_id,
            action_id,
            calculation_type
        } = req.body;
        let finalDesign;

        try {
            if (calculation_type === 'BUILDING') {
                finalDesign = await BuildingCalculation.findOne({
                    location_id,
                    building_id,
                    service_id,
                    sub_service_id,
                    action_id
                } as IBuildingCalculation);
            }

            if (calculation_type === 'SUB_BUILDING') {
                finalDesign = await SubBuildingCalculation.findOne({
                    location_id,
                    building_id,
                    sub_building_id,
                    service_id,
                    sub_service_id,
                    action_id,
                } as ISubBuildingCalculation);
            }

            if (calculation_type === 'LEVEL') {
                finalDesign = await LevelCalculation.findOne({
                    location_id,
                    building_id,
                    sub_building_id,
                    level_id,
                    service_id,
                    sub_service_id,
                    action_id,
                } as ILevelCalculation);
            }

            if (calculation_type === 'ROOM') {
                finalDesign = await RoomCalculation.findOne({
                    location_id,
                    building_id,
                    sub_building_id,
                    level_id,
                    room_id,
                    service_id,
                    sub_service_id,
                    action_id,
                } as IRoomCalculation);
            }
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.FINAL_DESIGN_DATA_DETAILS.code,
            message: ResponseCodes.FINAL_DESIGN_DATA_DETAILS.message,
            data: finalDesign
        });
    };

    static newFinalDesign = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const {
            location_id,
            building_id,
            sub_building_id,
            level_id,
            room_id,
            service_id,
            sub_service_id,
            action_id,
            action_data,
            calculation_type
        } = req.body;
        let finalDesign;

        try {
            if (calculation_type === 'BUILDING') {
                finalDesign = await BuildingCalculation.build({
                    location_id,
                    building_id,
                    service_id,
                    sub_service_id,
                    action_id,
                    action_data
                } as IBuildingCalculation).save();
            }

            if (calculation_type === 'SUB_BUILDING') {
                finalDesign = await SubBuildingCalculation.build({
                    location_id,
                    building_id,
                    sub_building_id,
                    service_id,
                    sub_service_id,
                    action_id,
                    action_data
                } as ISubBuildingCalculation).save();
            }

            if (calculation_type === 'LEVEL') {
                finalDesign = await LevelCalculation.build({
                    location_id,
                    building_id,
                    sub_building_id,
                    level_id,
                    service_id,
                    sub_service_id,
                    action_id,
                    action_data
                } as ILevelCalculation).save();
            }

            if (calculation_type === 'ROOM') {
                finalDesign = await RoomCalculation.build({
                    location_id,
                    building_id,
                    sub_building_id,
                    level_id,
                    room_id,
                    service_id,
                    sub_service_id,
                    action_id,
                    action_data
                } as IRoomCalculation).save();
            }
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.FINAL_DESIGN_DATA_CREATED.code,
            message: ResponseCodes.FINAL_DESIGN_DATA_CREATED.message,
        });
    };

    static editFinalDesign = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { calculation_type } = req.body;

        let finalDesign;

        try {
            if (calculation_type === 'BUILDING') {
                finalDesign = await BuildingCalculation.updateOne({ _id: id }, { $set: req.body });
            }

            if (calculation_type === 'SUB_BUILDING') {
                finalDesign = await SubBuildingCalculation.updateOne({ _id: id }, { $set: req.body });
            }

            if (calculation_type === 'LEVEL') {
                finalDesign = await LevelCalculation.updateOne({ _id: id }, { $set: req.body });
            }

            if (calculation_type === 'ROOM') {
                finalDesign = await RoomCalculation.updateOne({ _id: id }, { $set: req.body });
            }
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.FINAL_DESIGN_DATA_UPDATED.code,
            message: ResponseCodes.FINAL_DESIGN_DATA_UPDATED.message,
            data: finalDesign?.modifiedCount
        });
    };
}

export default FinalDesignController;
