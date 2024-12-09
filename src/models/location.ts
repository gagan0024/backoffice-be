import mongoose from 'mongoose';

export interface ILocation {
    name: string;
    image?: string;
}

interface LocationDoc extends mongoose.Document {
    name: string;
    image?: string;
}

const locationSchema = new mongoose.Schema<ILocation>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [2, 'Name too short'],
            maxLength: [40, 'Name too long'],
        },
        image: {
            type: String,
            trim: true,
        }
    },
    // Created at and updated at timestamps
    { timestamps: true }
);

interface LocationModelInterface extends mongoose.Model<LocationDoc> {
    build(attr: ILocation): LocationDoc;
}

locationSchema.statics.build = (attr: ILocation) => {
    return new Location(attr);
};

locationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const Location = mongoose.model<LocationDoc, LocationModelInterface>('Location', locationSchema);

export { Location };
