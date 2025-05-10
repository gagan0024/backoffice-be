// Add dotenv for environment variables
import * as dotenv from "dotenv";
dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || "SECRET@123",
    audience: process.env.JWT_AUDIENCE || "ISSUER",
    issuer: process.env.JWT_ISSUER || "AUDIENCE",
  },
  port: process.env.PORT || 8080,
  prefix: process.env.API_PREFIX || "api",
  // databaseUri: process.env.MONGODB_URI || 'mongodb://admin:designdrafter@10.160.0.6:27017/manas'
  // databaseUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  databaseUri:
    process.env.MONGODB_URI ||
    "mongodb://admin:designdrafter@10.160.0.6:27017/manas",
    GCP_PROJECT_ID:'prod-infra',
    GCP_BUCKET_NAME:'alpha-p7e-client',
    GOOGLE_APPLICATION_CREDENTIALS:'../../cloud/prod-infra-442609-4205d9e6e6f6.json'
};

export default config;
