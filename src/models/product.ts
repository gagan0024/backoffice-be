import mongoose from 'mongoose';

// Interface for the Product attributes
export interface IProduct {
    name: string;
    type?: string[];
    capacity?: string;
    vendors: string[];
    sub_service_id: mongoose.Schema.Types.ObjectId; // Reference to the Sub Service
}

// Interface for the Product Document (instance methods)
interface ProductDoc extends mongoose.Document {
    name: string;
    type?: string[];
    capacity?: string;
    vendors: string[];
    sub_service_id: mongoose.Schema.Types.ObjectId;
}

// Product Schema
const productSchema = new mongoose.Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: [String],
            trim: true,
        },
        capacity: {
            type: String,
            trim: true,
        },
        vendors: {
            type: [String],
            trim: true,
        },
        sub_service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubService',
            required: true,
        }
    },
    { timestamps: true } // Automatically include createdAt and updatedAt fields
);

// Interface for the Product Model (static methods)
interface ProductModelInterface extends mongoose.Model<ProductDoc> {
    build(attr: IProduct): ProductDoc;
}

// Static `build` method for creating new Product instances
productSchema.statics.build = (attr: IProduct) => {
    return new Product(attr);
};

// JSON transformation to remove sensitive/unnecessary fields
productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Create the Product model
const Product = mongoose.model<ProductDoc, ProductModelInterface>('Product', productSchema);

export { Product };
