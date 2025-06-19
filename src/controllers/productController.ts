import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
interface ProductResponse {
  id: string;
  name: string;
  price: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit = 10, page = 1, category } = req.query as {
      limit?: string;
      page?: string;
      category?: string;
    };
    const skip = (Number(page) - 1) * Number(limit);
    const where = category ? { category: { equals: category } } : {};

    const products = await prisma.product.findMany({
      where,
      take: Number(limit),
      skip,
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalProducts / Number(limit));

    return res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};