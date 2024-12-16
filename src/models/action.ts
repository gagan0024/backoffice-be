import mongoose from 'mongoose';

// Sub-Building Interface
export interface IAction {
    name: string;
    description: string;
    sub_service_id: mongoose.Types.ObjectId;
}

// Sub-Building Document Interface
interface ActionDoc extends mongoose.Document {
    name: string;
    description: string;
    sub_service_id: mongoose.Types.ObjectId;
}

// Sub-Building Schema
const actionSchema = new mongoose.Schema<IAction>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Action name too short'],
            maxLength: [50, 'Action name too long'],
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: [500, 'Description too long'],
        },
        sub_service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubService',
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new Building document
interface ActionModelInterface extends mongoose.Model<ActionDoc> {
    build(attr: IAction): ActionDoc;
}

// Add a static build method to the Building model
actionSchema.statics.build = (attr: IAction) => {
    return new Action(attr);
};

// Configure schema to transform output JSON
actionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubBuilding model
const Action = mongoose.model<ActionDoc, ActionModelInterface>('Action', actionSchema);

export { Action };
