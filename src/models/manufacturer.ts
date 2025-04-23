import mongoose from "mongoose";

// Manufacturer Interface
export interface IManufacturer {
  name: string;
  product_sub_service_id: mongoose.Types.ObjectId;
}

// Manufacturer Document Interface
interface ManufacturerDoc extends mongoose.Document {
  name: string;
  product_sub_service_id: mongoose.Types.ObjectId;
}

// Product Schema
const manufacturerSchema = new mongoose.Schema<IManufacturer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Manufacturer name too short"],
      maxLength: [100, "Manufacturer name too long"],
    },
    product_sub_service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubService",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Manufacturer document
interface ManufacturerModelInterface extends mongoose.Model<ManufacturerDoc> {
  build(attr: IManufacturer): ManufacturerDoc;
}

// Add a static build method to the Manufacturer model
manufacturerSchema.statics.build = (attr: IManufacturer) => {
  return new Manufacturer(attr);
};

// Configure schema to transform output JSON
manufacturerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

// Create the SubBuilding model
const Manufacturer = mongoose.model<
  ManufacturerDoc,
  ManufacturerModelInterface
>("Manufacturer", manufacturerSchema);

export { Manufacturer };
