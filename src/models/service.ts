import mongoose from 'mongoose';

// Service Interface
export interface IService {
    name: string;
    description: string;
    image?: string;
}

// Service Document Interface
interface ServiceDoc extends mongoose.Document {
    name: string;
    description: string;
    image?: string;
}

// Service Schema
const serviceSchema = new mongoose.Schema<IService>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: [2, 'Service name too short'],
            maxLength: [50, 'Service name too long'],
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

// Static method for creating a new Service document
interface ServiceModelInterface extends mongoose.Model<ServiceDoc> {
    build(attr: IService): ServiceDoc;
}

// Add a static build method to the Service model
serviceSchema.statics.build = (attr: IService) => {
    return new Service(attr);
};

// Configure schema to transform output JSON
serviceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the Service model
const Service = mongoose.model<ServiceDoc, ServiceModelInterface>('Service', serviceSchema);

export { Service };
