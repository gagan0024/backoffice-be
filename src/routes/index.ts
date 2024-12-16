import { NextFunction, Request, Response, Router } from 'express';
import auth from './admin/auth';
import user from './admin/user';
import location from './admin/location'
import building from './admin/building'
import subBuilding from './admin/sub-building'
import level from './admin/level'
import room from './admin/room'
import service from './admin/service'
import subService from './admin/sub-service'
import action from './admin/action'
import product from './admin/product'
import { NotFoundError } from '../exceptions/notFoundError';

const routes = Router();

// Admin routes
routes.use('/admin/auth', auth);
routes.use('/admin/users', user);
routes.use('/admin/locations', location);
routes.use('/admin/buildings', building);
routes.use('/admin/sub-buildings', subBuilding);
routes.use('/admin/levels', level);
routes.use('/admin/rooms', room);
routes.use('/admin/services', service);
routes.use('/admin/sub-services', subService);
routes.use('/admin/actions', action);
routes.use('/admin/products', product);

// Handle not found routes
routes.use((req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError('Route not found')
});

export default routes;
