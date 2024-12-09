import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Location, ILocation } from '../../models/location';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class LocationController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Execute the query
        const locations = await Location.find();

        // Send the locations object
        res.send({
            status: ResponseCodes.LOCATION_LIST.code,
            message: ResponseCodes.LOCATION_LIST.message,
            data: locations
        });
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const location = await Location.findById(id);
        if (!location) throw new NotFoundError(`Location with ID ${id} not found`);

        res.send({
            status: ResponseCodes.LOCATION_DETAILS.code,
            message: ResponseCodes.LOCATION_DETAILS.message,
            data: location?.toJSON()
        });
    };

    static newLocation = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        let { name, image } = req.body;
        let location;

        try {
            location = Location.build({ name, image } as ILocation);

            // Save the location
            await location.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send 201 response
        res.send({
            status: ResponseCodes.LOCATION_CREATED.code,
            message: ResponseCodes.LOCATION_CREATED.message,
            data: location.toJSON()
        });
    };

    static editLocation = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get values from the body
        const { name, image } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const location = await Location.findById(id);
        if (!location) throw new NotFoundError(`Location with ID ${id} not found`);

        // Edit the properties
        location.name = name ?? location.name
        location.image = image ?? location.image

        // Save and catch all validation errors
        try {
            await location.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.send({
            status: ResponseCodes.LOCATION_UPDATED.code,
            message: ResponseCodes.LOCATION_UPDATED.message,
            data: location.toJSON()
        });
    };

    static deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const location = await Location.findById(id);
        if (!location) throw new NotFoundError(`Location with ID ${id} not found`);

        await location.delete();

        // After all send a 204 (no content, but accepted) response
        res.send({
            status: ResponseCodes.LOCATION_DELETED.code,
            message: ResponseCodes.LOCATION_DELETED.message
        });
    };
}

export default LocationController;
