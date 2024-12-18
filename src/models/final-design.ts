import mongoose, { Schema } from 'mongoose';

// Final-Design Interface
export interface IFinalDesign {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// Final-Design Document Interface
interface FinalDesignDoc extends mongoose.Document {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// Final-Design Schema
const finalDesignSchema = new mongoose.Schema<IFinalDesign>(
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

// Static method for creating a new Building document
interface FianlDesignModelInterface extends mongoose.Model<FinalDesignDoc> {
    build(attr: IFinalDesign): FinalDesignDoc;
}

// Add a static build method to the Building model
finalDesignSchema.statics.build = (attr: IFinalDesign) => {
    return new FinalDesign(attr);
};

// Configure schema to transform output JSON
finalDesignSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuilding model
const FinalDesign = mongoose.model<FinalDesignDoc, FianlDesignModelInterface>('FinalDesign', finalDesignSchema);

export { FinalDesign };
