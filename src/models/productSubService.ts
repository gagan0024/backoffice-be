import mongoose from "mongoose";

// ProductSubService Interface
export interface IProductSubService {
  name: string;
  description: string;
  image?: string;
  service_id: mongoose.Types.ObjectId;
}

// ProductSubService Document Interface
interface ProductSubServiceDoc extends mongoose.Document {
  name: string;
  description: string;
  image?: string;
  service_id: mongoose.Types.ObjectId;
}

// ProductSubService Schema
const productSubServiceSchema = new mongoose.Schema<IProductSubService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Sub-service name too short"],
      maxLength: [50, "Sub-service name too long"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: [500, "Description too long"],
    },
    image: {
      type: String,
      trim: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new ProductSubService document
interface ProductSubServiceModelInterface
  extends mongoose.Model<ProductSubServiceDoc> {
  build(attr: IProductSubService): ProductSubServiceDoc;
}

// Add a static build method to the ProductSubService model
productSubServiceSchema.statics.build = (attr: IProductSubService) => {
  return new ProductSubService(attr);
};

// Configure schema to transform output JSON
productSubServiceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the ProductSubService model
const ProductSubService = mongoose.model<
  ProductSubServiceDoc,
  ProductSubServiceModelInterface
>("ProductSubService", productSubServiceSchema);

export { ProductSubService };
