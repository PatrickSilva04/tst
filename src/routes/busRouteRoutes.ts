import express from "express";
import { getBusRoutes, getBusRouteById } from "../controllers/busRouteController";
const router = express.Router();

// Public routes for bus routes
router.get("/routes", getBusRoutes);
router.get("/routes/:id", getBusRouteById);

export default router;

