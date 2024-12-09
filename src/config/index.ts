// Add dotenv for environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'SECRET@123',
        audience: process.env.JWT_AUDIENCE || 'ISSUER',
        issuer: process.env.JWT_ISSUER || 'AUDIENCE'
    },
    port: process.env.PORT || 3000,
    prefix: process.env.API_PREFIX || 'api',
    databaseUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manas'
};

export default config;
