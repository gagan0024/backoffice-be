import { Router } from 'express';
import ProductController from '../../controllers/admin/ProductController';
import { ROLES } from '../../utils/constants';

// Middleware
import { asyncHandler } from '../../middleware/asyncHandler';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

// Get all products
router.get('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ProductController.listAll));

// Get one product
router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ProductController.getOneById));

// Create a new product
router.post('/', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ProductController.newProduct));

// Edit one product
router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ProductController.editProduct));

// Delete one product
router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole([ROLES.ADMIN])], asyncHandler(ProductController.deleteProduct));

// Get all product categories
router.get('/categories', [checkJwt, checkRole([ROLES.USER, ROLES.ADMIN])], asyncHandler(ProductController.listProductCategories));

export default router;
