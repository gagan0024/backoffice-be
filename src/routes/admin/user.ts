import { Router } from 'express';
import UserController from '../../controllers/admin/UserController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all users
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(UserController.listAll));

// Get one user
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(UserController.getOneById));

// Create a new user
router.post('/', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(UserController.newUser));

// Edit one user
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(UserController.editUser));

// Delete one user
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(UserController.deleteUser));

export default router;
