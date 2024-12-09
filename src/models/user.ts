import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '../utils/constants';

// User Interface
export interface IUser {
    email: string;
    password: string;
    role: string;
}

// User Document Interface
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    role: string;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
}

// User Schema
const userSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [8, 'Email too short'],
            maxLength: [40, 'Email too long'],
            validate: {
                validator: async function (v: string): Promise<boolean> {
                    let doc: any = await User.findOne({ email: v });
                    // @ts-ignore
                    if (doc) return this._id.toString() === doc._id.toString();
                    else return Boolean(!doc);
                },
                message: 'Email already in use.'
            }
        },
        password: {
            type: String,
            required: true,
            minLength: [8, 'Password too short'],
            maxLength: [120, 'Password too long']
        },
        role: {
            type: String,
            required: true,
            enum: [ROLES.USER, ROLES.ADMIN],
            default: ROLES.USER
        }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Hash the password prior to saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords, instance method for the user
userSchema.method('isPasswordCorrect', async function (providedPassword: string): Promise<boolean> {
    return await bcrypt.compare(providedPassword, this.password);
});

// Static method for creating a new User document
interface userModelInterface extends mongoose.Model<UserDoc> {
    build(attr: IUser): UserDoc;
}

// Add a static build method
userSchema.statics.build = (attr: IUser) => {
    return new User(attr);
};

// Configure schema to transform output JSON
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const User = mongoose.model<UserDoc, userModelInterface>('User', userSchema);

export { User };
