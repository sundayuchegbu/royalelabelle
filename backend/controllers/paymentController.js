import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Consultation from "../models/Consultation.js";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create
export const createStripePayment = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (appointment.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been paid for",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        appointmentId,
        userId,
        serviceType: appointment.serviceType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: req.user.email,
      description: `Appointment: ${appointment.serviceType}`,
    });

    appointment.paymentMethod = "stripe";
    appointment.stripePaymentId = paymentIntent.id;
    await appointment.save();

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentMethod: "stripe",
    });
  } catch (error) {
    console.error("Stripe payment creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment",
    });
  }
};

// @desc    Get payment info for all methods
// @route   GET /api/payments/info
export const getPaymentInfo = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      methods: {
        stripe: {
          available: true,
          description: "Pay with credit/debit card",
          processingTime: "Instant",
        },
        zelle: {
          available: true,
          email: process.env.ZELLE_EMAIL,
          phone: process.env.ZELLE_PHONE,
          name: process.env.ZELLE_NAME,
          description: "Pay with Zelle (US banks only)",
          processingTime: "24-48 hours for verification",
        },
        interac: {
          available: true,
          email: process.env.INTERAC_EMAIL,
          phone: process.env.INTERAC_PHONE,
          name: process.env.INTERAC_NAME,
          description: "Pay with Interac e-Transfer (Canadian banks)",
          processingTime: "24-48 hours for verification",
        },
        cash: {
          available: true,
          description: "Pay in person with cash",
          notes: process.env.CASH_NOTES,
          processingTime: "At appointment time",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
