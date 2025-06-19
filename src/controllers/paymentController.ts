const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Process payment
const processPayment = async (req, res) => {
  try {
    const { cardId, amount } = req.body;
    const userId = req.user.userId;

    // Generate unique transaction ID
    const transactionId = uuidv4();

    // Simulate payment processing (in real app, integrate with payment gateway)
    const status = Math.random() > 0.1 ? 'approved' : 'declined'; // 90% success rate

    const payment = await prisma.payment.create({
      data: {
        userId,
        cardId,
        amount,
        status,
        transactionId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        card: {
          select: {
            id: true,
            cardHolderName: true,
            brand: true
          }
        }
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get payments
const getPayments = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (userId) where.userId = userId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        card: {
          select: {
            id: true,
            cardHolderName: true,
            brand: true
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        card: {
          select: {
            id: true,
            cardHolderName: true,
            brand: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  processPayment,
  getPayments,
  getPaymentById
};

