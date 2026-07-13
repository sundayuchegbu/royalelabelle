import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send confirmation email
const sendConfirmationEmail = async (user, appointment, consultation) => {
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
    subject: "✅ Appointment Confirmed - Royale la&apos;belle",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdf8f6;">
        <div style="text-align: center; padding: 20px; background: #4a2b1d; border-radius: 10px;">
          <h1 style="color: #c48d2c; font-family: Georgia, serif;">Locs by HairArena</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #4a2b1d;">Appointment Confirmed! 🎉</h2>
          <p style="color: #7f482f;">Dear ${user.name},</p>
          <p style="color: #7f482f;">Your appointment has been confirmed. Here are the details:</p>
          
          <div style="background: #fdf8f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
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
            <p><strong>Remaining Balance:</strong> $${appointment.fullPrice - appointment.depositAmount}</p>
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
              <li>Payment accepted via Zelle or Cash</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f6ede8;">
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" 
               style="display: inline-block; background: #c48d2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px;">
              View Appointment
            </a>
          </div>
          
          <p style="color: #7f482f; margin-top: 20px; text-align: center;">
            Looking forward to locking with you! 💛<br>
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
    console.log(`📧 Confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// Send payment failed email
const sendPaymentFailedEmail = async (user, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "⚠️ Payment Failed - Locs by HairArena",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d63031;">Payment Failed</h2>
        <p>Dear ${user.name},</p>
        <p>Your payment for the appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} could not be processed.</p>
        <p>Please try again or contact us at (646) 400-7132.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const appointmentId = paymentIntent.metadata.appointmentId;
    const userId = paymentIntent.metadata.userId;

    // Update appointment status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        stripePaymentId: paymentIntent.id,
        status: "confirmed",
        paymentMethod: "stripe",
      },
      { new: true },
    );

    if (!appointment) {
      console.error(`❌ Appointment not found: ${appointmentId}`);
      return;
    }

    // Update consultation status
    await Consultation.findByIdAndUpdate(appointment.consultationId, {
      status: "completed",
    });

    // Get user details
    const user = await User.findById(userId);

    // Send appointment confirmed email to customer
    if (user) {
      sendAppointmentConfirmedEmail(user, appointment).catch((error) => {
        console.error("Failed to send appointment confirmed email:", error);
      });
    }

    console.log(`✅ Appointment confirmed: ${appointmentId}`);
  } catch (error) {
    console.error("❌ Error handling payment success:", error);
  }
};

// Handle payment failure
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const appointmentId = paymentIntent.metadata.appointmentId;
    const userId = paymentIntent.metadata.userId;

    // Update appointment status
    await Appointment.findByIdAndUpdate(appointmentId, { status: "pending" });

    // Get user details and send failure email
    const user = await User.findById(userId);
    const appointment = await Appointment.findById(appointmentId);

    if (user && appointment) {
      await sendPaymentFailedEmail(user, appointment);
    }

    console.log(`❌ Payment failed for appointment: ${appointmentId}`);
  } catch (error) {
    console.error("❌ Error handling payment failure:", error);
  }
};

// Main webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📦 Webhook received: ${event.type}`);

  // Handle different event types
  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSuccess(event.data.object);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailure(event.data.object);
      break;

    case "payment_intent.canceled":
      console.log("Payment canceled:", event.data.object.id);
      break;

    case "charge.refunded":
      console.log("Payment refunded:", event.data.object.id);
      // Handle refund logic if needed
      break;

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  return res.json({ received: true });
};
