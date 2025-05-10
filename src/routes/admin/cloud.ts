import { Router } from 'express';
import ActionController from '../../controllers/admin/ActionController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import GcpController from '../../controllers/admin/GcpController';

const router = Router();

router.get('/get-url',  asyncHandler( GcpController.getStorageUrl ));

export default router;