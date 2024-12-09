import { Error } from 'mongoose';

export const processErrors = (error: Error.ValidationError): string => {
    if (!error) return '';
    return error.message;
};
