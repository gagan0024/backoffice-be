import mongoose from 'mongoose';

// Define the interface for attributes to create a LocationBuilding
export interface ILocationBuilding {
    locationId: mongoose.Types.ObjectId;
    buildingId: mongoose.Types.ObjectId;
    createdAt?: Date;
}

// Define the interface for a LocationBuilding document
interface LocationBuildingDoc extends mongoose.Document {
    locationId: mongoose.Types.ObjectId;
    buildingId: mongoose.Types.ObjectId;
    createdAt: Date;
}

// Create the schema for LocationBuilding
const locationBuildingSchema = new mongoose.Schema<ILocationBuilding>(
    {
        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true,
        },
        buildingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false } // You can use this if you don't need MongoDB's default timestamps
);

// Define the interface for the LocationBuilding model
interface LocationBuildingModelInterface extends mongoose.Model<LocationBuildingDoc> {
    build(attr: ILocationBuilding): LocationBuildingDoc;
}

// Add a static method to build new instances
locationBuildingSchema.statics.build = (attr: ILocationBuilding) => {
    return new LocationBuilding(attr);
};

// Configure the `toJSON` transformation
locationBuildingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Create and export the model
const LocationBuilding = mongoose.model<LocationBuildingDoc, LocationBuildingModelInterface>('LocationBuilding', locationBuildingSchema);

export { LocationBuilding };
