import mongoose, { Schema } from 'mongoose';

// RoomCalculation Interface
export interface IRoomCalculation {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    room_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// RoomCalculation Document Interface
interface RoomCalculationDoc extends mongoose.Document {
    location_id: mongoose.Types.ObjectId;
    building_id: mongoose.Types.ObjectId;
    sub_building_id: mongoose.Types.ObjectId;
    level_id: mongoose.Types.ObjectId;
    room_id: mongoose.Types.ObjectId;
    service_id: mongoose.Types.ObjectId;
    sub_service_id: mongoose.Types.ObjectId;
    action_id: mongoose.Types.ObjectId;
    action_data: Record<string, any>;
}

// RoomCalculation Schema
const roomCalculationSchema = new mongoose.Schema<IRoomCalculation>(
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
        room_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
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

// Static method for creating a new RoomCalculation document
interface RoomCalculationModelInterface extends mongoose.Model<RoomCalculationDoc> {
    build(attr: IRoomCalculation): RoomCalculationDoc;
}

// Add a static build method to the RoomCalculation model
roomCalculationSchema.statics.build = (attr: IRoomCalculation) => {
    return new RoomCalculation(attr);
};

// Configure schema to transform output JSON
roomCalculationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the RoomCalculation model
const RoomCalculation = mongoose.model<RoomCalculationDoc, RoomCalculationModelInterface>('RoomCalculation', roomCalculationSchema);

export { RoomCalculation };
