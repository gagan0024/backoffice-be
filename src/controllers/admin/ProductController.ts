import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../../exceptions/clientError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { Product, IProduct } from '../../models/product';
import { processErrors } from '../../utils/errorProcessing';
import { ResponseCodes } from '../../utils/constants';

class ProductController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the Service ID from the url
            const { sub_service_id } = req.query; // Access query parameter
            let products = []

            if (sub_service_id) {
                // Execute the query with service_id
                products = await Product.find({ sub_service_id })
                    .populate('sub_service_id', ['_id', 'name', 'description', 'image']);
            } else {
                // Execute the query
                products = await Product.find()
                    .populate('sub_service_id', ['_id', 'name', 'description', 'image']);
            }

            // Send the products object
            res.send({
                status: ResponseCodes.PRODUCT_LIST.code,
                message: ResponseCodes.PRODUCT_LIST.message,
                data: products
            });
        } catch (error) {
            next(error);
        }
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Fetch the product and populate service details
            const product = await Product.findById(id)
                .populate('sub_service_id', ['_id', 'name', 'description', 'image'])
                .select(['_id', 'name', 'capacity', 'vendors', 'sub_service', 'service_id']);

            // Throw an error if the product is not found
            if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

            // Send the product object
            res.send({
                status: ResponseCodes.PRODUCT_DETAILS.code,
                message: ResponseCodes.PRODUCT_DETAILS.message,
                data: product.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static newProduct = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        const { name, type, capacity, vendors, sub_service_id } = req.body;

        try {
            // Build a new Product instance
            const product = Product.build({ name, type, capacity, vendors, sub_service_id } as IProduct);

            // Save the product to the database
            await product.save();

            // Send the created product object
            res.send({
                status: ResponseCodes.PRODUCT_CREATED.code,
                message: ResponseCodes.PRODUCT_CREATED.message,
                data: product.toJSON()
            });
        } catch (e: any) {
            console.error(e);
            // Catch and process validation errors
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static editProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Get updated details from the body
            const { name, type, capacity, vendors, sub_service_id } = req.body;

            // Find the product by ID
            const product = await Product.findById(id).select([
                '_id',
                'name',
                'type',
                'capacity',
                'vendors',
                'sub_service_id',
            ]);

            // Throw an error if the product is not found
            if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

            // Update product attributes
            product.name = name;
            product.type = type;
            product.capacity = capacity;
            product.vendors = vendors;
            product.sub_service_id = sub_service_id;

            // Save the updated product and catch validation errors
            try {
                await product.save();
            } catch (e: any) {
                const error = e as Error.ValidationError;
                throw new ClientError(processErrors(error));
            }

            // Send the updated product object
            res.send({
                status: ResponseCodes.PRODUCT_UPDATED.code,
                message: ResponseCodes.PRODUCT_UPDATED.message,
                data: product.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the ID from the URL
            const id: string = req.params.id;

            // Find the product by ID
            const product = await Product.findById(id).select(['_id', 'name', 'capacity', 'vendors', 'sub_service_id']);

            // Throw an error if the product is not found
            if (!product) throw new NotFoundError(`Product with ID ${id} not found`);

            // Delete the product
            await product.delete();

            // Send a 204 response
            res.send({
                status: ResponseCodes.PRODUCT_DELETED.code,
                message: ResponseCodes.PRODUCT_DELETED.message,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ProductController;
