import mongoose from 'mongoose';

// Sub-Building Interface
export interface IRoom {
    name: string;
    description: string;
    level_id: mongoose.Types.ObjectId;
}

// Sub-Building Document Interface
interface RoomDoc extends mongoose.Document {
    name: string;
    description: string;
    level_id: mongoose.Types.ObjectId;
}

// Sub-Building Schema
const roomSchema = new mongoose.Schema<IRoom>(
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
        level_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Level',
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Building document
interface RoomModelInterface extends mongoose.Model<RoomDoc> {
    build(attr: IRoom): RoomDoc;
}

// Add a static build method to the Building model
roomSchema.statics.build = (attr: IRoom) => {
    return new Room(attr);
};

// Configure schema to transform output JSON
roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuilding model
const Room = mongoose.model<RoomDoc, RoomModelInterface>('Room', roomSchema);

export { Room };
