const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const complaint = await prisma.complaint.create({
      data: {
        userId,
        title,
        description
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get complaints
const getComplaints = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (userId) where.userId = userId;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update complaint
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { title, description, status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    res.json(complaint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint
};

