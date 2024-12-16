import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { SubBuilding, ISubBuilding } from '../../models/sub-building';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class SubBuildingController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Get the Building ID from the url
        const { building_id } = req.query; // Access query parameter
        let subBuildings = []

        if (building_id) {
            // Execute the query with building_id
            subBuildings = await SubBuilding.find({ building_id });
        } else {
            // Execute the query
            subBuildings = await SubBuilding.find();
        }

        // Send the subBuildings object
        res.send({
            status: ResponseCodes.SUB_BUILDING_LIST.code,
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

        res.send({
            status: ResponseCodes.SUB_BUILDING_DETAILS.code,
            message: ResponseCodes.SUB_BUILDING_DETAILS.message,
            data: subBuilding?.toJSON()
        });
    };

    static newSubBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { building_id, type, description } = req.body;
        let building;

        try {
            building = SubBuilding.build({ building_id, type, description } as ISubBuilding);

            // Save the building
            await building.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.SUB_BUILDING_CREATED.code,
            message: ResponseCodes.SUB_BUILDING_CREATED.message,
            data: building.toJSON()
        });
    };

    static editSubBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { building_id, type, description } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const subBuilding = await SubBuilding.findById(id);
        if (!subBuilding) throw new NotFoundError(`Sub Building with ID ${id} not found`);

        // Edit the properties
        subBuilding.building_id = building_id
        subBuilding.type = type
        subBuilding.description = description

        // Save and catch all validation errors
        try {
            await subBuilding.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.send({
            status: ResponseCodes.SUB_BUILDING_UPDATED.code,
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
        res.send({
            status: ResponseCodes.SUB_BUILDING_DELETED.code,
            message: ResponseCodes.SUB_BUILDING_DELETED.message
        });
    };
}

export default SubBuildingController;
