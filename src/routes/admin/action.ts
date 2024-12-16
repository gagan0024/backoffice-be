import { Router } from 'express';
import ActionController from '../../controllers/admin/ActionController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all levels
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ActionController.listAll));

// Get one level
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ActionController.getOneById));

// Create a new level
router.post('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ActionController.newAction));

// Edit one level
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ActionController.editAction));

// Delete one level
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(ActionController.deleteAction));

export default router;
