import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Building, IBuilding } from '../../models/building';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class BuildingController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Execute the query
            const buildings = await Building.find();

            // Send the buildings object
            res.send({
                status: ResponseCodes.BUILDING_LIST.code,
                message: ResponseCodes.BUILDING_LIST.message,
                data: buildings
            });
        } catch (e: any) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        try {
            // Mongoose automatically casts the id to ObjectID
            const building = await Building.findById(id);
            if (!building) throw new NotFoundError(`Building with ID ${id} not found`);

            res.send({
                status: ResponseCodes.BUILDING_DETAILS.code,
                message: ResponseCodes.BUILDING_DETAILS.message,
                data: building?.toJSON()
            });
        } catch (e: any) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static newBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { type, description, image } = req.body;
        let building;

        try {
            building = Building.build({ type, description, image } as IBuilding);

            // Save the building
            await building.save();
        } catch (e: any) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send 201 response
        res.send({
            status: ResponseCodes.BUILDING_CREATED.code,
            message: ResponseCodes.BUILDING_CREATED.message,
            data: building.toJSON()
        });
    };

    static editBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { type, description, image } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const building = await Building.findById(id);
        if (!building) throw new NotFoundError(`Building with ID ${id} not found`);

        // Edit the properties
        building.type = type
        building.description = description
        building.image = image

        // Save and catch all validation errors
        try {
            await building.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.send({
            status: ResponseCodes.BUILDING_UPDATED.code,
            message: ResponseCodes.BUILDING_UPDATED.message,
            data: building.toJSON()
        });
    };

    static deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        try {
            // Mongoose automatically casts the id to ObjectID
            const building = await Building.findById(id);
            if (!building) throw new NotFoundError(`Building with ID ${id} not found`);

            await building.delete();

            // After all send a 204 (no content, but accepted) response
            res.send({
                status: ResponseCodes.BUILDING_DELETED.code,
                message: ResponseCodes.BUILDING_DELETED.message
            });
        } catch (e: any) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };
}

export default BuildingController;
