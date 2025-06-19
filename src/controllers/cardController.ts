import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
interface CardResponse {
  id: string;
  number: string;
  expiry: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const addCard = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number, expiry, cvc, name } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const card = await prisma.card.create({
      data: {
        number,
        expiry,
        cvc,
        name,
        userId,
      },
      select: {
        id: true,
        number: true,
        expiry: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(card);
  } catch (error) {
    console.error("Error adding card:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cards = await prisma.card.findMany({
      where: { userId },
      select: {
        id: true,
        number: true,
        expiry: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const card = await prisma.card.findUnique({
      where: { id },
      select: {
        id: true,
        number: true,
        expiry: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCard = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.card.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting card:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};