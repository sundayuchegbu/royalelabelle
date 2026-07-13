import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create Zelle payment request
// @route   POST /api/payments/zelle/create
export const createZellePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify appointment belongs to user
    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if appointment already has a payment
    if (
      appointment.status === "confirmed" ||
      appointment.status === "payment_verified"
    ) {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been paid for",
      });
    }

    // Update appointment payment method
    appointment.paymentMethod = "zelle";
    appointment.status = "payment_pending";
    await appointment.save();

    // Get user details
    const user = await User.findById(userId);

    // Send Zelle payment instructions
    await sendZelleInstructions(user, appointment);

    res.status(200).json({
      success: true,
      message: "Zelle payment instructions sent to your email",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        paymentMethod: "zelle",
        zelleInfo: {
          email: process.env.ZELLE_EMAIL,
          phone: process.env.ZELLE_PHONE,
          name: process.env.ZELLE_NAME,
          amount: appointment.depositAmount,
        },
      },
    });
  } catch (error) {
    console.error("Zelle payment creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Zelle payment",
    });
  }
};

// Send Zelle payment instructions email
const sendZelleInstructions = async (user, appointment) => {
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
    subject: "💰 Zelle Payment Instructions - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">Zelle Payment Required 💰</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">To confirm your appointment, please send the deposit via Zelle:</p>
          
          <div style="background: #fff5e6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c48d2c;">
            <h3 style="color: #4a2b1d; margin-top: 0;">📋 Zelle Payment Details</h3>
            <p><strong>Recipient Name:</strong> ${process.env.ZELLE_NAME}</p>
            <p><strong>Email:</strong> ${process.env.ZELLE_EMAIL}</p>
            <p><strong>Phone:</strong> ${process.env.ZELLE_PHONE}</p>
            <p><strong>Amount:</strong> $${appointment.depositAmount}</p>
            <p><strong>Reference:</strong> Appointment #${appointment._id.toString().slice(-6)}</p>
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
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #c48d2c;">
            <h3 style="color: #4a2b1d;">📌 Next Steps</h3>
            <ol style="color: #7f482f; padding-left: 20px;">
              <li>Open your banking app and send the payment via Zelle</li>
              <li>Use the reference: <strong>Appointment #${appointment._id.toString().slice(-6)}</strong></li>
              <li>After sending, click the "Verify Payment" button below</li>
              <li>We'll confirm your payment within 24 hours</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/zelle/verify/${appointment._id}" 
               style="display: inline-block; background: #c48d2c; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ✅ Verify My Payment
            </a>
          </div>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="color: #7f482f; margin: 0; font-size: 14px;">
              ⚠️ <strong>Important:</strong> Please ensure you send the exact amount and include the reference number. 
              Your appointment will only be confirmed after we verify your payment.
            </p>
          </div>
          
          <p style="color: #7f482f; margin-top: 20px; text-align: center;">
            Have questions? Call or text us at (646) 400-7132<br>
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
    console.log(`📧 Zelle instructions sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send payment instructions");
  }
};

// @desc    Verify Zelle payment (User submits verification)
// @route   POST /api/payments/zelle/verify
export const verifyZellePayment = async (req, res) => {
  try {
    const { appointmentId, transactionId, paymentDate, notes } = req.body;
    const userId = req.user.id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify appointment belongs to user
    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if appointment is in payment pending state
    if (appointment.status !== "payment_pending") {
      return res.status(400).json({
        success: false,
        message: "This appointment is not pending payment verification",
      });
    }

    // Update appointment with verification details
    appointment.zelleTransactionId = transactionId;
    appointment.zellePaymentDate = paymentDate || new Date();
    appointment.zelleVerificationNotes = notes || "Payment sent via Zelle";
    appointment.status = "payment_verified"; // Pending admin confirmation
    await appointment.save();

    // Notify admin (You can implement admin notification here)
    await notifyAdminZellePayment(appointment, req.user);

    res.status(200).json({
      success: true,
      message:
        "Payment verification submitted. We will confirm your payment within 24 hours.",
      appointment,
    });
  } catch (error) {
    console.error("Zelle verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// Notify admin about Zelle payment
const notifyAdminZellePayment = async (appointment, user) => {
  const adminEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "💰 New Zelle Payment Verification Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>💰 Zelle Payment Verification Required</h2>
        <div style="background: #fdf8f6; padding: 15px; border-radius: 8px;">
          <p><strong>User:</strong> ${user.name} (${user.email})</p>
          <p><strong>Appointment:</strong> ${appointment._id}</p>
          <p><strong>Service:</strong> ${appointment.serviceType}</p>
          <p><strong>Amount:</strong> $${appointment.depositAmount}</p>
          <p><strong>Transaction ID:</strong> ${appointment.zelleTransactionId}</p>
          <p><strong>Payment Date:</strong> ${new Date(appointment.zellePaymentDate).toLocaleString()}</p>
          <p><strong>Notes:</strong> ${appointment.zelleVerificationNotes}</p>
        </div>
        <div style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}/admin/zelle/verify/${appointment._id}" 
             style="display: inline-block; background: #c48d2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Verify Payment in Admin
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification sent for Zelle payment`);
  } catch (error) {
    console.error("❌ Admin notification failed:", error);
  }
};

// @desc    Admin confirms Zelle payment
// @route   PUT /api/payments/zelle/admin/confirm/:appointmentId
export const adminConfirmZellePayment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    // Verify admin access (you'll need to add admin middleware)
    // For now, we'll check if user has admin role (you need to implement this)

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update appointment status
    appointment.status = "confirmed";
    appointment.zelleVerifiedBy = req.user.id;
    appointment.zelleVerifiedAt = new Date();
    if (notes) {
      appointment.zelleVerificationNotes = notes;
    }
    await appointment.save();

    // Update consultation status
    await Consultation.findByIdAndUpdate(appointment.consultationId, {
      status: "completed",
    });

    // Get user and send confirmation
    const user = await User.findById(appointment.userId);
    if (user) {
      await sendZelleConfirmationEmail(user, appointment);
    }

    res.status(200).json({
      success: true,
      message: "Zelle payment confirmed successfully",
      appointment,
    });
  } catch (error) {
    console.error("Admin Zelle confirmation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

// Send Zelle confirmation email
const sendZelleConfirmationEmail = async (user, appointment) => {
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
    subject: "✅ Zelle Payment Confirmed - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">✅ Payment Confirmed!</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">Great news! Your Zelle payment has been confirmed.</p>
          
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
            <p style="color: #7f482f;">Between Liberty and Linwood in East New York</p>
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
    console.log(`📧 Zelle confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
