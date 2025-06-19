import express, { Router } from "express";
import { authenticateToken} from "../utils/auth";
import {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { body, param } from "express-validator";
import rateLimit from "express-rate-limit";

const router: Router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

import { Request, Response, NextFunction } from "express";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post(
  "/register",
  authLimiter,
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").optional().isString().withMessage("Name must be a string"),
  ],
  asyncHandler(registerUser)
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  asyncHandler(loginUser)
);

router.get(
  "/users/:id",
  authenticateToken,
  [param("id").isString().notEmpty().withMessage("Invalid user ID")],
  asyncHandler(getUserById)
);

router.put(
  "/users/:id",
  authenticateToken,
  [
    param("id").isString().notEmpty().withMessage("Invalid user ID"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").optional().isString().withMessage("Name must be a string"),
  ],
  asyncHandler(updateUser)
);

router.delete(
  "/users/:id",
  authenticateToken,
  [param("id").isString().notEmpty().withMessage("Invalid user ID")],
  asyncHandler(deleteUser)
);

export default router;