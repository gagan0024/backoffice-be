import { Router } from "express";
import { ROLES } from "../../utils/constants";

// Middleware
import { asyncHandler } from "../../middleware/asyncHandler";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import ManufacturerController from "../../controllers/admin/ManufacturerController";

const router = Router();

// Get all products
router.get(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ManufacturerController.listAll)
);

// Get one product
router.get(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ManufacturerController.getOneById)
);

// Create a new product
router.post(
  "/",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ManufacturerController.newManufacturer)
);

// Edit one product
router.patch(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])],
  asyncHandler(ManufacturerController.editManufacturer)
);

// Delete one product
router.delete(
  "/:id([0-9a-z]{24})",
  [checkJwt, checkRole([ROLES.ADMIN])],
  asyncHandler(ManufacturerController.deleteManufacturer)
);

export default router;
