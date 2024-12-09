import mongoose from 'mongoose';

// Main Building Interface
export interface IBuilding {
    type: string;
    description: string;
    image?: string;
}

// Building Document Interface
interface BuildingDoc extends mongoose.Document {
    type: string;
    description: string;
    image?: string;
}

// Main Building Schema
const buildingSchema = new mongoose.Schema<IBuilding>(
    {
        type: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minLength: [2, 'Building type too short'],
            maxLength: [50, 'Building type too long'],
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: [500, 'Description too long'],
        },
        image: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Building document
interface BuildingModelInterface extends mongoose.Model<BuildingDoc> {
    build(attr: IBuilding): BuildingDoc;
}

// Add a static build method to the Building model
buildingSchema.statics.build = (attr: IBuilding) => {
    return new Building(attr);
};

// Configure schema to transform output JSON
buildingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the Building model
const Building = mongoose.model<BuildingDoc, BuildingModelInterface>('Building', buildingSchema);

export { Building };
