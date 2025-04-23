import { NextFunction, Request, Response } from "express";
import { IFinalProduct, FinalProduct } from "../../models/final-product";
import { ClientError } from "../../exceptions/clientError";
import { Error } from "mongoose";
import { processErrors } from "../../utils/errorProcessing";
import { ResponseCodes } from "../../utils/constants";

class FinalProductController {
  static newFinalProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Get parameters from the body
    const {
      service_id,
      product_sub_service_id,
      product_id,
      manufacturer_id,
      action_data,
    } = req.body;
    let finalDesign;
    try {
      finalDesign = await FinalProduct.build({
        service_id,
        product_sub_service_id,
        product_id,
        manufacturer_id,
        action_data,
      } as IFinalProduct).save();
    } catch (e: any) {
      console.error(e);
      const error = e as Error.ValidationError;
      throw new ClientError(processErrors(error));
    }

    // If all ok, send response
    res.send({
      status: ResponseCodes.FINAL_PRODUCT_CREATED.code,
      message: ResponseCodes.FINAL_PRODUCT_CREATED.message,
    });
  };
}
