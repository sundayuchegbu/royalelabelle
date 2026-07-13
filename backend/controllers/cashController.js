import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create Cash payment
// @route   POST /api/payments/cash/create
export const createCashPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
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
        message: "This appointment has already been confirmed",
      });
    }

    // Update appointment
    appointment.paymentMethod = "cash";
    appointment.status = "pending"; // Cash payments are confirmed in person
    await appointment.save();

    // Get user and send confirmation
    const user = await User.findById(userId);
    await sendCashConfirmation(user, appointment);

    res.status(200).json({
      success: true,
      message: "Cash payment option selected. Your appointment is confirmed.",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        paymentMethod: "cash",
        cashInfo: {
          notes:
            process.env.CASH_NOTES ||
            "Please bring exact cash amount to your appointment.",
          amountDue: appointment.fullPrice,
          depositAmount: appointment.depositAmount,
          remainingBalance: appointment.fullPrice - appointment.depositAmount,
        },
      },
    });
  } catch (error) {
    console.error("Cash payment creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create cash payment",
    });
  }
};

// Send Cash confirmation email
const sendCashConfirmation = async (user, appointment) => {
  const serviceNames = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "💰 Cash Payment Confirmed - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">Appointment Confirmed! 💰</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">Your appointment has been confirmed. You will pay with cash on the day of service.</p>
          
          <div style="background: #fdf8f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a2b1d;">📋 Appointment Details</h3>
            <p><strong>Service:</strong> ${serviceNames[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>Date:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          </div>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #4a2b1d; margin-top: 0;">💰 Payment Information</h3>
            <p><strong>Total Amount:</strong> $${appointment.fullPrice}</p>
            <p><strong>Deposit:</strong> $${appointment.depositAmount}</p>
            <p><strong>Remaining Balance:</strong> $${appointment.fullPrice - appointment.depositAmount}</p>
            <p style="margin-top: 10px; color: #4CAF50; font-weight: bold;">
              ✅ No deposit required upfront - Pay in full on appointment day
            </p>
          </div>
          
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800;">
            <h3 style="color: #4a2b1d;">📌 Cash Payment Notes</h3>
            <p style="color: #7f482f;">${process.env.CASH_NOTES || "Please bring exact cash amount to your appointment. ATM available nearby if needed."}</p>
          </div>
          
          <div style="background: #fdf8f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a2b1d;">📍 Location</h3>
            <p style="color: #7f482f;">735 Liberty Avenue<br>Brooklyn, NY 11208</p>
            <p style="color: #7f482f;">Between Liberty and Linwood in East New York</p>
          </div>
          
          <div style="background: #fff5e6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c48d2c;">
            <h3 style="color: #4a2b1d;">📋 Important Reminders</h3>
            <ul style="color: #7f482f; padding-left: 20px;">
              <li>Please arrive 10 minutes early</li>
              <li>Call or text (646) 400-7132 if running late</li>
              <li>$20 late fee applies after 15 minutes</li>
              <li>No extra guests allowed due to limited space</li>
              <li>Bring exact cash amount</li>
            </ul>
          </div>
          
          <p style="color: #7f482f; margin-top: 20px; text-align: center;">
            Looking forward to locking with you! 💛<br>
            <span style="color: #c48d2c;">- Zainab</span>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Cash confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// @desc    Admin marks cash payment as received
// @route   PUT /api/payments/cash/admin/receive/:appointmentId
export const adminReceiveCashPayment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.paymentMethod !== "cash") {
      return res.status(400).json({
        success: false,
        message: "This appointment is not a cash payment",
      });
    }

    appointment.status = "completed";
    appointment.cashReceivedBy = req.user.id;
    appointment.cashReceivedAt = new Date();
    if (notes) {
      appointment.cashVerificationNotes = notes;
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Cash payment received successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cash receipt error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to record cash payment",
    });
  }
};
