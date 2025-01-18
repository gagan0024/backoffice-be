import mongoose from 'mongoose';

// Product Category

// Interface for ProductCategory attributes
export interface IProductCategory {
    name: string;
    description?: string;
    factors: string[]
}

// Interface for ProductCategory Document (instance methods)
interface ProductCategoryDoc extends mongoose.Document {
    name: string;
    description?: string;
    factors: string[]
}

// ProductCategory Schema
const productCategorySchema = new mongoose.Schema<IProductCategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        factors: {
            type: [String],
            trim: true,
        },
    },
    { timestamps: true } // Automatically include createdAt and updatedAt fields
);

// Interface for the Product Model (static methods)
interface ProductCategoryModelInterface extends mongoose.Model<ProductCategoryDoc> {
    build(attr: IProductCategory): ProductCategoryDoc;
}

// Static `build` method for creating new Product instances
productCategorySchema.statics.build = (attr: IProductCategory) => {
    return new ProductCategory(attr);
};

// JSON transformation to remove sensitive/unnecessary fields
productCategorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Create the ProductCategory model
const ProductCategory = mongoose.model<ProductCategoryDoc>('ProductCategory', productCategorySchema);

export { ProductCategory };


// --------------------------------- Product Schema ---------------------------------------//

interface Factor {
    name: string;
    value: string;
}

// Interface for the Product attributes
export interface IProduct {
    name: string;
    type?: string[];
    capacity?: string;
    vendors: string[];
    factors: Factor[];
    sub_service_id: mongoose.Schema.Types.ObjectId; // Reference to the Sub Service
    category_id?: mongoose.Schema.Types.ObjectId; // Reference to ProductCategory
}

// Interface for the Product Document (instance methods)
interface ProductDoc extends mongoose.Document {
    name: string;
    type?: string[];
    capacity?: string;
    vendors: string[];
    factors: Factor[];
    sub_service_id: mongoose.Schema.Types.ObjectId;
    category_id?: mongoose.Schema.Types.ObjectId; // Reference to ProductCategory
}

const factorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

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
        factors: {
            type: [factorSchema],
        },
        sub_service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubService',
            required: true,
        }
    },
    { timestamps: true } // Automatically include createdAt and updatedAt fields
);

// Add `category_id` field to the Product schema to link it to ProductCategory
productSchema.add({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: false, // Optional if a product can exist without a category
    },
});

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
