import mongoose, { Schema } from 'mongoose';

// BuildingCalculation Interface
export interface IBuildingCalculation {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// BuildingCalculation Document Interface
interface BuildingCalculationDoc extends mongoose.Document {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// BuildingCalculation Schema
const buildingCalculationSchema = new mongoose.Schema<IBuildingCalculation>(
    {
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true
        },
        building_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            required: true
        },
        service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        sub_service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubService',
            required: true
        },
        action_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Action',
            required: true
        },
        action_data: {
            type: Map,
            of: Schema.Types.Mixed,
            required: true
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new BuildingCalculation document
interface BuildingCalculationModelInterface extends mongoose.Model<BuildingCalculationDoc> {
    build(attr: IBuildingCalculation): BuildingCalculationDoc;
}

// Add a static build method to the BuildingCalculation model
buildingCalculationSchema.statics.build = (attr: IBuildingCalculation) => {
    return new BuildingCalculation(attr);
};

// Configure schema to transform output JSON
buildingCalculationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the BuildingCalculation model
const BuildingCalculation = mongoose.model<BuildingCalculationDoc, BuildingCalculationModelInterface>('BuildingCalculation', buildingCalculationSchema);

export { BuildingCalculation };
