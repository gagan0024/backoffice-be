import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Level, ILevel } from '../../models/level';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class LevelController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Get the Sub Building ID from the url
        const { sub_building_id } = req.query; // Access query parameter
        let levels = []

        if (sub_building_id) {
            // Execute the query with sub_building_id
            levels = await Level.find({ sub_building_id });
        } else {
            // Execute the query
            levels = await Level.find();
        }

        // Send the levels object
        res.send({
            status: ResponseCodes.LEVEL_LIST.code,
            message: ResponseCodes.LEVEL_LIST.message,
            data: levels
        });
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const level = await Level.findById(id);
        if (!level) throw new NotFoundError(`Level with ID ${id} not found`);

        res.send({
            status: ResponseCodes.LEVEL_DETAILS.code,
            message: ResponseCodes.LEVEL_DETAILS.message,
            data: level?.toJSON()
        });
    };

    static newLevel = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { sub_building_id, name, description } = req.body;
        let level;

        try {
            level = Level.build({ sub_building_id, name, description } as ILevel);

            // Save the level
            await level.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.LEVEL_CREATED.code,
            message: ResponseCodes.LEVEL_CREATED.message,
            data: level.toJSON()
        });
    };

    static editLevel = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { sub_building_id, name, description } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const level = await Level.findById(id);
        if (!level) throw new NotFoundError(`Level with ID ${id} not found`);

        // Edit the properties
        level.sub_building_id = sub_building_id
        level.name = name
        level.description = description

        // Save and catch all validation errors
        try {
            await level.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.send({
            status: ResponseCodes.LEVEL_UPDATED.code,
            message: ResponseCodes.LEVEL_UPDATED.message,
            data: level.toJSON()
        });
    };

    static deleteLevel = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const level = await Level.findById(id);
        if (!level) throw new NotFoundError(`Level with ID ${id} not found`);

        await level.delete();

        // After all send response
        res.send({
            status: ResponseCodes.LEVEL_DELETED.code,
            message: ResponseCodes.LEVEL_DELETED.message
        });
    };
}

export default LevelController;
