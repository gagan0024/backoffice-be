import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import { IManufacturer, Manufacturer } from "../../models/manufacturer";

class ManufacturerController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    // Get the Product Sub Service ID from the url
    const { product_sub_service_id } = req.query; // Access query parameter
    let manufacturer = [];

    if (product_sub_service_id) {
      // Execute the query with product_sub_service_id
      manufacturer = await Manufacturer.find({
        product_sub_service_id,
      }).populate("product_sub_service_id");
    } else {
      // Execute the query
      manufacturer = await Manufacturer.find().populate(
        "product_sub_service_id"
      );
    }

    // Send the product object
    res.send({
      status: ResponseCodes.MANUFACTURER_LIST.code,
      message: ResponseCodes.MANUFACTURER_LIST.message,
      data: manufacturer,
    });
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id: string = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer)
      throw new NotFoundError(`Manufacturer with ID ${id} not found`);

    res.send({
      status: ResponseCodes.MANUFACTURER_DETAILS.code,
      message: ResponseCodes.MANUFACTURER_DETAILS.message,
      data: manufacturer?.toJSON(),
    });
  };

  static newManufacturer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get parameters from the body
    const { product_sub_service_id, name } = req.body;
    let manufacturer;

    try {
      manufacturer = Manufacturer.build({
        product_sub_service_id,
        name,
      } as IManufacturer);

      // Save the product
      await manufacturer.save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    // If all ok, send response
    res.send({
      status: ResponseCodes.MANUFACTURER_CREATED.code,
      message: ResponseCodes.MANUFACTURER_CREATED.message,
      data: manufacturer.toJSON(),
    });
  };

  static editManufacturer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const { product_sub_service_id, name } = req.body;

    // Mongoose automatically casts the id to ObjectID
    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer)
      throw new NotFoundError(`Manufacturer with ID ${id} not found`);

    // Edit the properties
    manufacturer.product_sub_service_id = product_sub_service_id;
    manufacturer.name = name;

    // Save and catch all validation errors
    try {
      await manufacturer.save();
    } catch (e) {
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    res.send({
      status: ResponseCodes.MANUFACTURER_UPDATED.code,
      message: ResponseCodes.MANUFACTURER_UPDATED.message,
      data: manufacturer.toJSON(),
    });
  };

  static deleteManufacturer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get the ID from the url
    const id = req.params.id;

    // Mongoose automatically casts the id to ObjectID
    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer)
      throw new NotFoundError(`Manufacturer with ID ${id} not found`);

    await manufacturer.delete();

    // After all send response
    res.send({
      status: ResponseCodes.MANUFACTURER_DELETED.code,
      message: ResponseCodes.MANUFACTURER_DELETED.message,
    });
  };
}

export default ManufacturerController;
