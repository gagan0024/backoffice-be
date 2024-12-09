import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Service, IService } from '../../models/service';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class ServiceController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch all services with the selected fields
            const services = await Service.find();

            // Send the services object
            res.status(ResponseCodes.SERVICE_LIST.code).type('json').send({
                message: ResponseCodes.SERVICE_LIST.message,
                data: services
            });
        } catch (error) {
            next(error);
        }
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Fetch the service by ID
            const service = await Service.findById(id);

            // Throw an error if the service is not found
            if (!service) throw new NotFoundError(`Service with ID ${id} not found`);

            // Send the service object
            res.status(ResponseCodes.SERVICE_DETAILS.code).type('json').send({
                message: ResponseCodes.SERVICE_DETAILS.message,
                data: service?.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static newService = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { name, description, image } = req.body;

        try {
            // Build a new Service instance
            const service = Service.build({ name, description, image } as IService);

            // Save the service to the database
            await service.save();

            // Send the created service object
            res.status(ResponseCodes.SERVICE_CREATED.code).type('json').send({
                message: ResponseCodes.SERVICE_CREATED.message,
                data: service.toJSON()
            });
        } catch (e: any) {
            console.error(e);
            // Catch and process validation errors
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static editService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Get updated details from the body
            const { name, description, image } = req.body;

            // Fetch the service by ID
            const service = await Service.findById(id);

            // Throw an error if the service is not found
            if (!service) throw new NotFoundError(`Service with ID ${id} not found`);

            // Update service attributes
            service.name = name ?? service.name;
            service.description = description ?? service.description;
            service.image = image ?? service.image;

            // Save the updated service and catch validation errors
            try {
                await service.save();
            } catch (e) {
                const error = e as Error.ValidationError;
                throw new ClientError(processErrors(error));
            }

            // Send the updated service object
            res.status(ResponseCodes.SERVICE_UPDATED.code).type('json').send({
                message: ResponseCodes.SERVICE_UPDATED.message,
                data: service.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static deleteService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Fetch the service by ID
            const service = await Service.findById(id);

            // Throw an error if the service is not found
            if (!service) throw new NotFoundError(`Service with ID ${id} not found`);

            // Delete the service
            await service.delete();

            // Send a 204 response
            res.status(ResponseCodes.SERVICE_DELETED.code).type('json').send({
                message: ResponseCodes.SERVICE_DELETED.message
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ServiceController;
