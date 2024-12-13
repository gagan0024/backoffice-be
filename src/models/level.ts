import mongoose from 'mongoose';

// Sub-Building Interface
export interface ILevel {
    name: string;
    description: string;
    sub_building_id: mongoose.Types.ObjectId;
}

// Sub-Building Document Interface
interface LevelDoc extends mongoose.Document {
    name: string;
    description: string;
    sub_building_id: mongoose.Types.ObjectId;
}

// Sub-Building Schema
const levelSchema = new mongoose.Schema<ILevel>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Level name too short'],
            maxLength: [50, 'Level name too long'],
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: [500, 'Description too long'],
        },
        sub_building_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubBuilding',
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Building document
interface LevelModelInterface extends mongoose.Model<LevelDoc> {
    build(attr: ILevel): LevelDoc;
}

// Add a static build method to the Building model
levelSchema.statics.build = (attr: ILevel) => {
    return new Level(attr);
};

// Configure schema to transform output JSON
levelSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuilding model
const Level = mongoose.model<LevelDoc, LevelModelInterface>('Level', levelSchema);

export { Level };
