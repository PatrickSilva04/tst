import express, { Router } from "express";
import { authenticateToken } from "../utils/auth";
import { getProducts, getProductById } from "../controllers/productController";
import { param, query } from "express-validator";

const router: Router = express.Router();

router.get(
  "/products",
  authenticateToken,
  [
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("category").optional().isString(),
  ],
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    getProducts(req, res).catch(next);
  }
);

router.get(
  "/products/:id",
  authenticateToken,
  [param("id").isString().notEmpty().withMessage("Invalid product ID")],
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    getProductById(req, res).catch(next);
  }
);

export default router;