import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the expected JWT payload structure
interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  // Check if token is provided
  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  // Verify JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    // Verify token
    const user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: "Token expired" });
      return;
    }
    // Log unexpected errors for debugging
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  res.status(500).json({ error: "Server configuration error" });
  return;
}
};