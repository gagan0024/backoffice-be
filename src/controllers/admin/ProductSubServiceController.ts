import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { ClientError } from "../../exceptions/clientError";
import { NotFoundError } from "../../exceptions/notFoundError";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";
import {
  IProductSubService,
  ProductSubService,
} from "../../models/productSubService";

class ProductSubServiceController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the Service ID from the url
      const { service_id } = req.query; // Access query parameter
      let productSubServices = [];

      if (service_id) {
        // Execute the query with service_id
        productSubServices = await ProductSubService.find({ service_id });
      } else {
        // Execute the query
        productSubServices = await ProductSubService.find();
      }

      // Send the productSubServices object
      res.send({
        status: ResponseCodes.PRODUCT_SUB_SERVICE_LIST.code,
        message: ResponseCodes.PRODUCT_SUB_SERVICE_LIST.message,
        data: productSubServices,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Get the ID from the URL
      const id: string = req.params.id;

      // Fetch the service by ID
      const productSubService = await ProductSubService.findById(id);

      // Throw an error if the productSubService is not found
      if (!productSubService)
        throw new NotFoundError(`Product Sub Service with ID ${id} not found`);

      // Send the sub service object
      res.send({
        status: ResponseCodes.PRODUCT_SUB_SERVICE_DETAILS.code,
        message: ResponseCodes.PRODUCT_SUB_SERVICE_DETAILS.message,
        data: productSubService?.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  static newProductSubService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get parameters from the body
    const { service_id, name, description, image } = req.body;

    try {
      // Build a new SubService instance
      const productSubService = ProductSubService.build({
        service_id,
        name,
        description,
        image,
      } as IProductSubService);

      // Save the productSubService to the database
      await productSubService.save();

      // Send the created productSubService object
      res.send({
        status: ResponseCodes.PRODUCT_SUB_SERVICE_CREATED.code,
        message: ResponseCodes.PRODUCT_SUB_SERVICE_CREATED.message,
        data: productSubService.toJSON(),
      });
    } catch (e: any) {
      console.error(e);
      // Catch and process validation errors
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }
  };

  static editProductSubService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Get the ID from the URL
      const id: string = req.params.id;

      // Get updated details from the body
      const { service_id, name, description, image } = req.body;

      // Fetch the subService by ID
      const productSubService = await ProductSubService.findById(id);

      // Throw an error if the subService is not found
      if (!productSubService)
        throw new NotFoundError(`Sub Service with ID ${id} not found`);

      // Update service attributes
      productSubService.service_id = service_id ?? productSubService.service_id;
      productSubService.name = name ?? productSubService.name;
      productSubService.description =
        description ?? productSubService.description;
      productSubService.image = image ?? productSubService.image;

      // Save the updated service and catch validation errors
      try {
        await productSubService.save();
      } catch (e) {
        const error = e as Error.ValidationError;
        throw new ClientError(processErrors(error));
      }

      // Send the updated service object
      res.send({
        status: ResponseCodes.PRODUCT_SUB_SERVICE_UPDATED.code,
        message: ResponseCodes.PRODUCT_SUB_SERVICE_UPDATED.message,
        data: productSubService.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteProductSubService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Get the ID from the URL
      const id: string = req.params.id;

      // Fetch the productSubService by ID
      const productSubService = await ProductSubService.findById(id);

      // Throw an error if the productSubService is not found
      if (!productSubService)
        throw new NotFoundError(`Product Sub Service with ID ${id} not found`);

      // Delete the productSubService
      await productSubService.delete();

      // Send a 204 response
      res.send({
        status: ResponseCodes.PRODUCT_SUB_SERVICE_DELETED.code,
        message: ResponseCodes.PRODUCT_SUB_SERVICE_DELETED.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductSubServiceController;
