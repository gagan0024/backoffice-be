import mongoose from "mongoose";

// Product Interface
export interface IProduct {
  name: string;
  capacity: number;
  product_sub_service_id: mongoose.Types.ObjectId;
}

// Product Document Interface
interface ProductDoc extends mongoose.Document {
  name: string;
  capacity: number;
  product_sub_service_id: mongoose.Types.ObjectId;
}

// Product Schema
const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Product name too short"],
      maxLength: [50, "Product name too long"],
    },
    capacity: {
      type: Number,
      required: true,
      trim: true,
      maxLength: [50, "Capacity out of bounds"],
    },
    product_sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubService",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Product document
interface ProductModelInterface extends mongoose.Model<ProductDoc> {
  build(attr: IProduct): ProductDoc;
}

// Add a static build method to the Product model
productSchema.statics.build = (attr: IProduct) => {
  return new Product(attr);
};

// Configure schema to transform output JSON
productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the SubBuilding model
const Product = mongoose.model<ProductDoc, ProductModelInterface>(
  "Product",
  productSchema
);

export { Product };
