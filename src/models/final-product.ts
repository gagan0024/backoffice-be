import mongoose, { Schema } from "mongoose";

// BuildingCalculation Interface
export interface IFinalProduct {
  service_id: mongoose.Types.ObjectId;
  product_sub_service_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  manufacturer_id: mongoose.Types.ObjectId;
  action_data: Record<string, any>;
}

// BuildingCalculation Document Interface
interface FinalProductDoc extends mongoose.Document {
  service_id: mongoose.Types.ObjectId;
  product_sub_service_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  manufacturer_id: mongoose.Types.ObjectId;
  action_data: Record<string, any>;
}

// BuildingCalculation Schema
const finalProductSchema = new mongoose.Schema<IFinalProduct>(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    product_sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubService",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    manufacturer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    action_data: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new BuildingCalculation document
interface FinalProductModelInterface extends mongoose.Model<FinalProductDoc> {
  build(attr: IFinalProduct): FinalProductDoc;
}

// Add a static build method to the BuildingCalculation model
finalProductSchema.statics.build = (attr: IFinalProduct) => {
  return new FinalProduct(attr);
};

// Configure schema to transform output JSON
finalProductSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the FinalProduct model
const FinalProduct = mongoose.model<
  FinalProductDoc,
  FinalProductModelInterface
>("FinalProduct", finalProductSchema);

export { FinalProduct };
