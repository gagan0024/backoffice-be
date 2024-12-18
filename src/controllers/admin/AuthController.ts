import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { User } from '../../models/user';
import config from '../../config';
import { ClientError } from '../../exceptions/clientError';
import { UnauthorizedError } from '../../exceptions/unauthorizedError';
import { NotFoundError } from '../../exceptions/notFoundError';
import { processErrors } from '../../utils/errorProcessing';
import { Error } from 'mongoose';
import { CustomRequest } from '../../middleware/checkJwt';

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        // Check if email and password are set
        let { email, password } = req.body;
        if (!(email && password)) throw new ClientError('Email and password are required');

        // Get user from database
        const user = await User.findOne({ email: email }).exec();

        // Check if encrypted password match
        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new UnauthorizedError("Email and password don't match");
        }

        // Sing JWT, valid for 1 hour
        const token = sign({ userId: user._id.toString(), email: user.email, role: user.role }, config.jwt.secret!, {
            expiresIn: '7d',
            notBefore: '0', // Cannot use before now, can be configured to be deferred
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        });

        // Send the jwt in the response
        res.type('json').send({ token: token });
    };

    static changePassword = async (req: Request, res: Response, next: NextFunction) => {
        // Get ID from JWT
        const id = (req as CustomRequest).token.payload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) throw new ClientError("Passwords don't match");

        // Get user from the database
        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found`);
        } else if (!(await user.isPasswordCorrect(oldPassword))) {
            throw new UnauthorizedError("Old password doesn't match");
        }

        // Store new pasword
        user.password = newPassword;

        try {
            // Just save, validation will happen when saving
            await user.save();
        } catch (e) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(204).send();
    };
}
export default AuthController;
