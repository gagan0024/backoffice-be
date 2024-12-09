import mongoose from 'mongoose';

// Sub-Building Interface
export interface ISubBuilding {
    type: string;
    levels: string[];
    building_id: mongoose.Types.ObjectId;
}

// Sub-Building Document Interface
interface SubBuildingDoc extends mongoose.Document {
    type: string;
    levels: string[];
    building_id: mongoose.Types.ObjectId;
}

// Sub-Building Schema
const subBuildingSchema = new mongoose.Schema<ISubBuilding>(
    {
        type: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Sub-building type too short'],
            maxLength: [50, 'Sub-building type too long'],
        },
        levels: {
            type: [String],
            required: true,
            validate: {
                validator: (val: string[]) => val.length > 0,
                message: 'Levels must contain at least one level',
            },
        },
        building_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Building',
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Building document
interface SubBuildingModelInterface extends mongoose.Model<SubBuildingDoc> {
    build(attr: ISubBuilding): SubBuildingDoc;
}

// Add a static build method to the Building model
subBuildingSchema.statics.build = (attr: ISubBuilding) => {
    return new SubBuilding(attr);
};

// Configure schema to transform output JSON
subBuildingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuilding model
const SubBuilding = mongoose.model<SubBuildingDoc, SubBuildingModelInterface>('SubBuilding', subBuildingSchema);

export { SubBuilding };
