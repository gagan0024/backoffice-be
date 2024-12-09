import mongoose from 'mongoose';

// SubService Interface
export interface ISubService {
    name: string;
    description: string;
    image?: string;
    service_id: mongoose.Types.ObjectId;
}

// SubService Document Interface
interface SubServiceDoc extends mongoose.Document {
    name: string;
    description: string;
    image?: string;
    service_id: mongoose.Types.ObjectId;
}

// SubService Schema
const subServiceSchema = new mongoose.Schema<ISubService>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, 'Sub-service name too short'],
            maxLength: [50, 'Sub-service name too long'],
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
        service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Static method for creating a new SubService document
interface SubServiceModelInterface extends mongoose.Model<SubServiceDoc> {
    build(attr: ISubService): SubServiceDoc;
}

// Add a static build method to the SubService model
subServiceSchema.statics.build = (attr: ISubService) => {
    return new SubService(attr);
};

// Configure schema to transform output JSON
subServiceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    },
});

// Create the SubService model
const SubService = mongoose.model<SubServiceDoc, SubServiceModelInterface>('SubService', subServiceSchema);

export { SubService };
