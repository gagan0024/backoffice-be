import { Router } from "express";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import ProductSubServiceController from "../../controllers/admin/ProductSubServiceController";

const router = Router();

// Get all services
router.get(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ProductSubServiceController.listAll)
);

// Get one service
router.get(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ProductSubServiceController.getOneById)
);

// Create a new service
router.post(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ProductSubServiceController.newProductSubService)
);

// Edit one service
router.patch(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ProductSubServiceController.editProductSubService)
);

// Delete one service
router.delete(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.ADMIN])],
  asyncHandler(ProductSubServiceController.deleteProductSubService)
);

export default router;
