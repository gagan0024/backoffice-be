import { Router } from 'express';
import SubBuildingController from '../../controllers/admin/SubBuildingController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all sub-buildings
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(SubBuildingController.listAll));

// Get one sub-building
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(SubBuildingController.getOneById));

// Create a new sub-building
router.post('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(SubBuildingController.newSubBuilding));

// Edit one sub-building
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(SubBuildingController.editSubBuilding));

// Delete one sub-building
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(SubBuildingController.deleteSubBuilding));

export default router;
