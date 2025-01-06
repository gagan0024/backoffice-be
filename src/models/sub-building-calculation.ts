import mongoose, { Schema } from 'mongoose';

// SubBuildingCalculation Interface
export interface ISubBuildingCalculation {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// SubBuildingCalculation Document Interface
interface SubBuildingCalculationDoc extends mongoose.Document {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// SubBuildingCalculation Schema
const subBuildingCalculationSchema = new mongoose.Schema<ISubBuildingCalculation>(
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
        sub_building_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubBuilding',
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

// Static method for creating a new SubBuildingCalculation document
interface SubBuildingCalculationModelInterface extends mongoose.Model<SubBuildingCalculationDoc> {
    build(attr: ISubBuildingCalculation): SubBuildingCalculationDoc;
}

// Add a static build method to the SubBuildingCalculation model
subBuildingCalculationSchema.statics.build = (attr: ISubBuildingCalculation) => {
    return new SubBuildingCalculation(attr);
};

// Configure schema to transform output JSON
subBuildingCalculationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuildingCalculation model
const SubBuildingCalculation = mongoose.model<SubBuildingCalculationDoc, SubBuildingCalculationModelInterface>('SubBuildingCalculation', subBuildingCalculationSchema);

export { SubBuildingCalculation };
