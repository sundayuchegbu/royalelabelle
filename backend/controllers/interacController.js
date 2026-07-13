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

// @desc    Create Interac payment
// @route   POST /api/payments/interac/create
export const createInteracPayment = async (req, res) => {
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
        message: "This appointment has already been paid for",
      });
    }

    // Update appointment
    appointment.paymentMethod = "interac";
    appointment.status = "payment_pending";
    await appointment.save();

    // Get user and send instructions
    const user = await User.findById(userId);
    await sendInteracInstructions(user, appointment);

    res.status(200).json({
      success: true,
      message: "Interac payment instructions sent to your email",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        paymentMethod: "interac",
        interacInfo: {
          email: process.env.INTERAC_EMAIL,
          phone: process.env.INTERAC_PHONE,
          name: process.env.INTERAC_NAME,
          amount: appointment.depositAmount,
        },
      },
    });
  } catch (error) {
    console.error("Interac payment creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Interac payment",
    });
  }
};

// Send Interac payment instructions
const sendInteracInstructions = async (user, appointment) => {
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
    subject: "💰 Interac e-Transfer Instructions - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">Interac e-Transfer Instructions 💰</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">To confirm your appointment, please send the deposit via Interac e-Transfer:</p>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="color: #4a2b1d; margin-top: 0;">📋 Interac e-Transfer Details</h3>
            <p><strong>Recipient Name:</strong> ${process.env.INTERAC_NAME}</p>
            <p><strong>Email:</strong> ${process.env.INTERAC_EMAIL}</p>
            <p><strong>Phone:</strong> ${process.env.INTERAC_PHONE}</p>
            <p><strong>Amount:</strong> $${appointment.depositAmount} CAD</p>
            <p><strong>Reference:</strong> Appointment #${appointment._id.toString().slice(-6)}</p>
            <p><strong>Security Question:</strong> What is my business name?</p>
            <p><strong>Security Answer:</strong> HairArena</p>
          </div>
          
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
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #2196F3;">
            <h3 style="color: #4a2b1d;">📌 Next Steps</h3>
            <ol style="color: #7f482f; padding-left: 20px;">
              <li>Log in to your online banking</li>
              <li>Select Interac e-Transfer</li>
              <li>Enter the recipient details above</li>
              <li>Send the payment and note the reference number</li>
              <li>Click the "Verify Payment" button below</li>
              <li>Enter your transaction reference number</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/interac/verify/${appointment._id}" 
               style="display: inline-block; background: #c48d2c; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ✅ Verify My Interac Payment
            </a>
          </div>
          
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800;">
            <p style="color: #7f482f; margin: 0; font-size: 14px;">
              ⚠️ <strong>Important:</strong> Please include the reference number in your transfer description. 
              Your appointment will be confirmed after we verify your payment.
            </p>
          </div>
          
          <p style="color: #7f482f; margin-top: 20px; text-align: center;">
            Questions? Call or text us at (646) 400-7132<br>
            <span style="color: #c48d2c;">- Zainab</span>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #7f482f; font-size: 12px;">
          <p>Locs by HairArena | AMP Certified Micro Locs Specialist</p>
          <p>📍 735 Liberty Avenue, Brooklyn, NY 11208 | 📞 (646) 400-7132</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Interac instructions sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send payment instructions");
  }
};

// @desc    Verify Interac payment (User submits verification)
// @route   POST /api/payments/interac/verify
export const verifyInteracPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      transactionId,
      referenceNumber,
      paymentDate,
      notes,
    } = req.body;
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

    if (appointment.status !== "payment_pending") {
      return res.status(400).json({
        success: false,
        message: "This appointment is not pending payment verification",
      });
    }

    // Update appointment with verification details
    appointment.interacTransactionId = transactionId;
    appointment.interacReferenceNumber = referenceNumber;
    appointment.interacPaymentDate = paymentDate || new Date();
    appointment.interacVerificationNotes = notes || "Payment sent via Interac";
    appointment.status = "payment_verified";
    await appointment.save();

    // Notify admin
    await notifyAdminInteracPayment(appointment, req.user);

    res.status(200).json({
      success: true,
      message:
        "Payment verification submitted. We will confirm your payment within 24 hours.",
      appointment,
    });
  } catch (error) {
    console.error("Interac verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// Notify admin about Interac payment
export const notifyAdminInteracPayment = async (appointment, user) => {
  const adminEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "💰 New Interac Payment Verification Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>💰 Interac Payment Verification Required</h2>
        <div style="background: #fdf8f6; padding: 15px; border-radius: 8px;">
          <p><strong>User:</strong> ${user.name} (${user.email})</p>
          <p><strong>Appointment:</strong> ${appointment._id}</p>
          <p><strong>Service:</strong> ${appointment.serviceType}</p>
          <p><strong>Amount:</strong> $${appointment.depositAmount}</p>
          <p><strong>Transaction ID:</strong> ${appointment.interacTransactionId}</p>
          <p><strong>Reference Number:</strong> ${appointment.interacReferenceNumber}</p>
          <p><strong>Payment Date:</strong> ${new Date(appointment.interacPaymentDate).toLocaleString()}</p>
          <p><strong>Notes:</strong> ${appointment.interacVerificationNotes}</p>
        </div>
        <div style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}/admin/interac/verify/${appointment._id}" 
             style="display: inline-block; background: #c48d2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Verify Payment in Admin
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification sent for Interac payment`);
  } catch (error) {
    console.error("❌ Admin notification failed:", error);
  }
};

// @desc    Admin confirms Interac payment
// @route   PUT /api/payments/interac/admin/confirm/:appointmentId
export const adminConfirmInteracPayment = async (req, res) => {
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

    appointment.status = "confirmed";
    appointment.interacVerifiedBy = req.user.id;
    appointment.interacVerifiedAt = new Date();
    if (notes) {
      appointment.interacVerificationNotes = notes;
    }
    await appointment.save();

    await Consultation.findByIdAndUpdate(appointment.consultationId, {
      status: "completed",
    });

    const user = await User.findById(appointment.userId);
    if (user) {
      await sendInteracConfirmationEmail(user, appointment);
    }

    res.status(200).json({
      success: true,
      message: "Interac payment confirmed successfully",
      appointment,
    });
  } catch (error) {
    console.error("Admin Interac confirmation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

// Send Interac confirmation email
export const sendInteracConfirmationEmail = async (user, appointment) => {
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
    subject: "✅ Interac Payment Confirmed - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">✅ Payment Confirmed!</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">Great news! Your Interac e-Transfer payment has been confirmed.</p>
          
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
            <p><strong>Deposit Paid:</strong> $${appointment.depositAmount}</p>
          </div>
          
          <div style="background: #fdf8f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a2b1d;">📍 Location</h3>
            <p style="color: #7f482f;">735 Liberty Avenue<br>Brooklyn, NY 11208</p>
          </div>
          
          <div style="background: #fff5e6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c48d2c;">
            <h3 style="color: #4a2b1d;">📋 Important Reminders</h3>
            <ul style="color: #7f482f; padding-left: 20px;">
              <li>Please arrive 10 minutes early</li>
              <li>Call or text (646) 400-7132 if running late</li>
              <li>$20 late fee applies after 15 minutes</li>
              <li>No extra guests allowed due to limited space</li>
              <li>Remaining balance due on day of service</li>
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
    console.log(`📧 Interac confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
