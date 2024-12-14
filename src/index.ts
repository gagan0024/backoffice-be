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

app.listen(config.port, (): void => {
    console.log(`Server is listening on port ${config.port}`);
});

// Add error handling middleware
app.use(errorHandler);
