import { Router } from 'express';
import RoomController from '../../controllers/admin/RoomController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all rooms
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(RoomController.listAll));

// Get one room
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(RoomController.getOneById));

// Create a new room
router.post('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(RoomController.newRoom));

// Edit one room
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(RoomController.editRoom));

// Delete one room
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(RoomController.deleteRoom));

export default router;
