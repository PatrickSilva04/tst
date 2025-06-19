// Use the existing PrismaClient instance from the main application
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

const getBusRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.busRoute.findMany({
      orderBy: {
        routeNumber: 'asc'
      }
    });

    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBusRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const route = await prisma.busRoute.findUnique({
      where: { id }
    });

    if (!route) {
      return res.status(404).json({ error: 'Bus route not found' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getBusRoutes,
  getBusRouteById
};
