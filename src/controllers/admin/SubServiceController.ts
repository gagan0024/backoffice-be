import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { SubService, ISubService } from '../../models/sub-service';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class SubServiceController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the Service ID from the url
            const { service_id } = req.query; // Access query parameter
            let subServices = []

            if (service_id) {
                // Execute the query with service_id
                subServices = await SubService.find({ service_id });
            } else {
                // Execute the query
                subServices = await SubService.find();
            }

            // Send the subServices object
            res.send({
                status: ResponseCodes.SUB_SERVICE_LIST.code,
                message: ResponseCodes.SUB_SERVICE_LIST.message,
                data: subServices
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
            const subService = await SubService.findById(id);

            // Throw an error if the subService is not found
            if (!subService) throw new NotFoundError(`Sub Service with ID ${id} not found`);

            // Send the sub service object
            res.send({
                status: ResponseCodes.SUB_SERVICE_DETAILS.code,
                message: ResponseCodes.SUB_SERVICE_DETAILS.message,
                data: subService?.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static newSubService = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { service_id, name, description, image } = req.body;

        try {
            // Build a new SubService instance
            const subService = SubService.build({ service_id, name, description, image } as ISubService);

            // Save the subService to the database
            await subService.save();

            // Send the created subService object
            res.send({
                status: ResponseCodes.SUB_SERVICE_CREATED.code,
                message: ResponseCodes.SUB_SERVICE_CREATED.message,
                data: subService.toJSON()
            });
        } catch (e: any) {
            console.error(e);
            // Catch and process validation errors
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static editSubService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Get updated details from the body
            const { service_id, name, description, image } = req.body;

            // Fetch the subService by ID
            const subService = await SubService.findById(id);

            // Throw an error if the subService is not found
            if (!subService) throw new NotFoundError(`Sub Service with ID ${id} not found`);

            // Update service attributes
            subService.service_id = service_id ?? subService.service_id;
            subService.name = name ?? subService.name;
            subService.description = description ?? subService.description;
            subService.image = image ?? subService.image;

            // Save the updated service and catch validation errors
            try {
                await subService.save();
            } catch (e) {
                const error = e as Error.ValidationError;
                throw new ClientError(processErrors(error));
            }

            // Send the updated service object
            res.send({
                status: ResponseCodes.SUB_SERVICE_UPDATED.code,
                message: ResponseCodes.SUB_SERVICE_UPDATED.message,
                data: subService.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static deleteSubService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Fetch the subService by ID
            const subService = await SubService.findById(id);

            // Throw an error if the subService is not found
            if (!subService) throw new NotFoundError(` Sub Service with ID ${id} not found`);

            // Delete the subService
            await subService.delete();

            // Send a 204 response
            res.send({
                status: ResponseCodes.SUB_SERVICE_DELETED.code,
                message: ResponseCodes.SUB_SERVICE_DELETED.message
            });
        } catch (error) {
            next(error);
        }
    };
}

export default SubServiceController;
