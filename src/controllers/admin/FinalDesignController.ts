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
    // static listAll = async (req: Request, res: Response, next: NextFunction) => {
    //     // Get the Sub Service ID from the url
    //     const {
    //         location_id,
    //         building_id,
    //         sub_building_id,
    //         level_id,
    //         service_id,
    //         sub_service_id,
    //         action_id,
    //     } = req.query; // Access query parameter
    //     let finalDesigns = []

    //     if (location_id || building_id || sub_building_id || level_id || service_id || sub_service_id || action_id) {
    //         // Execute the query with action_id
    //         finalDesigns = await FinalDesign.find({
    //             location_id,
    //             building_id,
    //             sub_building_id,
    //             level_id,
    //             service_id,
    //             sub_service_id,
    //             action_id,
    //         });
    //     } else {
    //         // Execute the query
    //         finalDesigns = await FinalDesign.find();
    //     }

    //     // Send the finalDesigns object
    //     res.send({
    //         status: ResponseCodes.FINAL_DESIGN_DATA_LIST.code,
    //         message: ResponseCodes.FINAL_DESIGN_DATA_LIST.message,
    //         data: finalDesigns
    //     });
    // };

    // static getOneById = async (req: Request, res: Response, next: NextFunction) => {
    //     // Get the ID from the url
    //     const id: string = req.params.id;

    //     // Mongoose automatically casts the id to ObjectID
    //     const finalDesign = await FinalDesign.findById(id);
    //     if (!finalDesign) throw new NotFoundError(`Final Design with ID ${id} not found`);

    //     res.send({
    //         status: ResponseCodes.FINAL_DESIGN_DATA_DETAILS.code,
    //         message: ResponseCodes.FINAL_DESIGN_DATA_DETAILS.message,
    //         data: finalDesign?.toJSON()
    //     });
    // };

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

    // static editFinalDesign = async (req: Request, res: Response, next: NextFunction) => {
    //     // Get the ID from the url
    //     const id = req.params.id;

    //     // Get values from the body
    //     const {
    //         location_id,
    //         building_id,
    //         sub_building_id,
    //         level_id,
    //         service_id,
    //         sub_service_id,
    //         action_id,
    //         action_data
    //     } = req.body;

    //     // Mongoose automatically casts the id to ObjectID
    //     const finalDesign = await FinalDesign.findById(id);
    //     if (!finalDesign) throw new NotFoundError(`Final Design with ID ${id} not found`);

    //     // Edit the properties
    //     finalDesign.location_id = location_id
    //     finalDesign.building_id = building_id
    //     finalDesign.sub_building_id = sub_building_id
    //     finalDesign.level_id = level_id
    //     finalDesign.service_id = service_id
    //     finalDesign.sub_service_id = sub_service_id
    //     finalDesign.action_id = action_id
    //     finalDesign.action_data = action_data

    //     // Save and catch all validation errors
    //     try {
    //         await finalDesign.save();
    //     } catch (e) {
    //         const error = e as Error.ValidationError;
    //         throw new ClientError(processErrors(error));
    //     }

    //     res.send({
    //         status: ResponseCodes.FINAL_DESIGN_DATA_UPDATED.code,
    //         message: ResponseCodes.FINAL_DESIGN_DATA_UPDATED.message,
    //         data: finalDesign.toJSON()
    //     });
    // };

    // static deleteFinalDesign = async (req: Request, res: Response, next: NextFunction) => {
    //     // Get the ID from the url
    //     const id = req.params.id;

    //     // Mongoose automatically casts the id to ObjectID
    //     const finalDesign = await FinalDesign.findById(id);
    //     if (!finalDesign) throw new NotFoundError(`Final Design with ID ${id} not found`);

    //     await finalDesign.delete();

    //     // After all send response
    //     res.send({
    //         status: ResponseCodes.FINAL_DESIGN_DATA_DELETED.code,
    //         message: ResponseCodes.FINAL_DESIGN_DATA_DELETED.message
    //     });
    // };
}

export default FinalDesignController;
