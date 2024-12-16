import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Action, IAction } from '../../models/action';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class ActionController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Execute the query
        const actions = await Action.find();

        // Send the actions object
        res.status(ResponseCodes.ACTION_LIST.code).type('json').send({
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

        res.status(ResponseCodes.ACTION_DETAILS.code).type('json').send({
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
        res.status(ResponseCodes.ACTION_CREATED.code).type('json').send({
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

        res.status(ResponseCodes.ACTION_UPDATED.code).type('json').send({
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
        res.status(ResponseCodes.ACTION_DELETED.code).type('json').send({
            message: ResponseCodes.ACTION_DELETED.message
        });
    };
}

export default ActionController;
