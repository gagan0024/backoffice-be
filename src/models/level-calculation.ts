import mongoose, { Schema } from 'mongoose';

// LevelCalculation Interface
export interface ILevelCalculation {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// LevelCalculation Document Interface
interface LevelCalculationDoc extends mongoose.Document {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// LevelCalculation Schema
const levelCalculationSchema = new mongoose.Schema<ILevelCalculation>(
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
        level_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Level',
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

// Static method for creating a new LevelCalculation document
interface LevelCalculationModelInterface extends mongoose.Model<LevelCalculationDoc> {
    build(attr: ILevelCalculation): LevelCalculationDoc;
}

// Add a static build method to the LevelCalculation model
levelCalculationSchema.statics.build = (attr: ILevelCalculation) => {
    return new LevelCalculation(attr);
};

// Configure schema to transform output JSON
levelCalculationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the LevelCalculation model
const LevelCalculation = mongoose.model<LevelCalculationDoc, LevelCalculationModelInterface>('LevelCalculation', levelCalculationSchema);

export { LevelCalculation };
