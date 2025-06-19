import express, { Router } from "express";
import { authenticateToken } from "../utils/auth";
import { addCard, getCards, getCardById, removeCard } from "../controllers/cardController";
import { body, param } from "express-validator";

const router: Router = express.Router();

router.post(
  "/cards",
  authenticateToken,
  [
    body("number").isCreditCard().withMessage("Invalid credit card number"),
    body("expiry").matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage("Invalid expiry date (MM/YY)"),
    body("cvc").isLength({ min: 3, max: 4 }).withMessage("Invalid CVC"),
    body("name").isString().notEmpty().withMessage("Cardholder name is required"),
  ],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await addCard(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/cards", authenticateToken, async (req, res, next) => {
  try {
    await getCards(req, res);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/cards/:id",
  authenticateToken,
  [param("id").isString().notEmpty().withMessage("Invalid card ID")],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await getCardById(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/cards/:id",
  authenticateToken,
  [param("id").isString().notEmpty().withMessage("Invalid card ID")],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await removeCard(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;