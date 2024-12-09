import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { SubBuilding, ISubBuilding } from '../../models/sub-building';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class SubBuildingController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Execute the query
        const subBuildings = await SubBuilding.find();

        // Send the subBuildings object
        res.status(ResponseCodes.SUB_BUILDING_LIST.code).type('json').send({
            message: ResponseCodes.SUB_BUILDING_LIST.message,
            data: subBuildings
        });
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const subBuilding = await SubBuilding.findById(id);
        if (!subBuilding) throw new NotFoundError(`Sub Building with ID ${id} not found`);

        res.status(ResponseCodes.SUB_BUILDING_DETAILS.code).type('json').send({
            message: ResponseCodes.SUB_BUILDING_DETAILS.message,
            data: subBuilding?.toJSON()
        });
    };

    static newSubBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { building_id, type, levels } = req.body;
        let building;

        try {
            building = SubBuilding.build({ building_id, type, levels } as ISubBuilding);

            // Save the building
            await building.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.status(ResponseCodes.SUB_BUILDING_CREATED.code).type('json').send({
            message: ResponseCodes.SUB_BUILDING_CREATED.message,
            data: building.toJSON()
        });
    };

    static editSubBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { building_id, type, levels } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const subBuilding = await SubBuilding.findById(id);
        if (!subBuilding) throw new NotFoundError(`Sub Building with ID ${id} not found`);

        // Edit the properties
        subBuilding.building_id = building_id
        subBuilding.type = type
        subBuilding.levels = levels

        // Save and catch all validation errors
        try {
            await subBuilding.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(ResponseCodes.SUB_BUILDING_UPDATED.code).type('json').send({
            message: ResponseCodes.SUB_BUILDING_UPDATED.message,
            data: subBuilding.toJSON()
        });
    };

    static deleteSubBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const subBuilding = await SubBuilding.findById(id);
        if (!subBuilding) throw new NotFoundError(`Sub Building with ID ${id} not found`);

        await subBuilding.delete();

        // After all send response
        res.status(ResponseCodes.SUB_BUILDING_DELETED.code).type('json').send({
            message: ResponseCodes.SUB_BUILDING_DELETED.message
        });
    };
}

export default SubBuildingController;
