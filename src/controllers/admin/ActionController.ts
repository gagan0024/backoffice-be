import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Action, IAction } from '../../models/action';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class ActionController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Get the Sub Service ID from the url
        const { sub_service_id } = req.query; // Access query parameter
        let actions = []

        if (sub_service_id) {
            // Execute the query with sub_service_id
            actions = await Action.find({ sub_service_id }).populate('sub_service_id');
        } else {
            // Execute the query
            actions = await Action.find().populate('sub_service_id');
        }

        // Send the actions object
        res.send({
            status: ResponseCodes.ACTION_LIST.code,
            message: ResponseCodes.ACTION_LIST.message,
            data: actions
        });
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const action = await Action.findById(id);
        if (!action) throw new NotFoundError(`Action with ID ${id} not found`);

        res.send({
            status: ResponseCodes.ACTION_DETAILS.code,
            message: ResponseCodes.ACTION_DETAILS.message,
            data: action?.toJSON()
        });
    };

    static newAction = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { sub_service_id, name, description } = req.body;
        let action;

        try {
            action = Action.build({ sub_service_id, name, description } as IAction);

            // Save the action
            await action.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send response
        res.send({
            status: ResponseCodes.ACTION_CREATED.code,
            message: ResponseCodes.ACTION_CREATED.message,
            data: action.toJSON()
        });
    };

    static editAction = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { sub_service_id, name, description } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const action = await Action.findById(id);
        if (!action) throw new NotFoundError(`Action with ID ${id} not found`);

        // Edit the properties
        action.sub_service_id = sub_service_id
        action.name = name
        action.description = description

        // Save and catch all validation errors
        try {
            await action.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.send({
            status: ResponseCodes.ACTION_UPDATED.code,
            message: ResponseCodes.ACTION_UPDATED.message,
            data: action.toJSON()
        });
    };

    static deleteAction = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const action = await Action.findById(id);
        if (!action) throw new NotFoundError(`Action with ID ${id} not found`);

        await action.delete();

        // After all send response
        res.send({
            status: ResponseCodes.ACTION_DELETED.code,
            message: ResponseCodes.ACTION_DELETED.message
        });
    };
}

export default ActionController;
