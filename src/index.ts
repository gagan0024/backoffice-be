import express, { Application, Request, Response } from 'express';
import mongoose, { ConnectOptions, Error as MongooseError } from 'mongoose';
import { json } from 'body-parser';
import cors from 'cors';
import routes from './routes/index';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import config from './config';

// Imports for creating a default user of type admin
import { User, IUser } from './models/user';

import { ClientError } from './exceptions/clientError';
import { processErrors } from './utils/errorProcessing';
import { ROLES } from './utils/constants';
import { migrate } from './config/db-migrate';

const app: Application = express();

// Add CORS middleware
app.use(cors());

// Add body-parser middleware
app.use(json());

// Add the routes with the base prefix
app.use(`/${config.prefix}`, routes);

// Define the welcome route
app.get('/health', (req: Request, res: Response): void => {
    res.send('Welcome! Your server is running perfectly.');
});

// Add error handling middleware
app.use(errorHandler);

// Configure mongoose globally
mongoose.set('strictQuery', true);

// Connect to the database
mongoose
    .connect(
        config.databaseUri!,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions // Explicitly cast options to ConnectOptions
    )
    .then(async (): Promise<void> => {
        console.log('Connected to Database - Initial Connection');

        // Create default admin user if it doesn't exist
        try {
            // Migrate default static/fixed data into database
            await migrate()
            const existingAdmin = await User.findOne({ email: 'admin@gmail.com', role: ROLES.ADMIN });
            if (!existingAdmin) {
                console.log('***** Creating Default Admin *****');

                const user = User.build({
                    email: 'admin@gmail.com',
                    password: '12345678',
                    role: ROLES.ADMIN,
                } as IUser);

                // Save the user
                await user.save();
            }
        } catch (e: unknown) {
            console.error(e);

            if (e instanceof MongooseError.ValidationError) {
                throw new ClientError(processErrors(e));
            } else {
                throw new ClientError('An unexpected error occurred.');
            }
        }

        // Start the server only if DB connection succeeds
        app.listen(config.port, (): void => {
            console.log(`Server is listening on port ${config.port}`);
        });
    })
    .catch((err: unknown): void => {
        console.error('Initial Database connection error occurred -', err);
    });