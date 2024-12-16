import { Router } from 'express';
import LevelController from '../../controllers/admin/LevelController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all levels
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(LevelController.listAll));

// Get one level
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(LevelController.getOneById));

// Create a new level
router.post('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(LevelController.newLevel));

// Edit one level
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(LevelController.editLevel));

// Delete one level
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(LevelController.deleteLevel));

export default router;
