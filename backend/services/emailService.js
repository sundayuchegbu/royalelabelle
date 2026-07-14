import nodemailer from "nodemailer";
import {
  welcomeEmailTemplate,
  bookingConfirmationTemplate,
  adminBookingNotificationTemplate,
  appointmentConfirmedTemplate,
  appointmentCompletedTemplate,
  statusChangeNotificationTemplate,
} from "../utils/emailTemplates.js";
import User from "../models/User.js";

// Create transporter with better error handling
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "⚠️ Email credentials not configured. Emails will not be sent.",
    );
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter)
      return { success: false, message: "Email not configured" };

    await transporter.verify();
    console.log("✅ Email service connected successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Email connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping welcome email");
      return { success: false, message: "Email not configured" };
    }

    const bookingLink = `${process.env.FRONTEND_URL || "https://royalelabelle.netlify.app"}/#booking`;
    const htmlContent = welcomeEmailTemplate(user, bookingLink);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to Royale la'belle! ✨",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Booking Confirmation Email (to customer)
export const sendBookingConfirmationEmail = async (user, appointment) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping booking confirmation");
      return { success: false, message: "Email not configured" };
    }

    const htmlContent = bookingConfirmationTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "📋 Booking Confirmation - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Booking confirmation sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send booking confirmation:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Appointment Confirmed Email
export const sendAppointmentConfirmedEmail = async (user, appointment) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping appointment confirmed");
      return { success: false, message: "Email not configured" };
    }

    const htmlContent = appointmentConfirmedTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Appointment Confirmed - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Appointment confirmed email sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "❌ Failed to send appointment confirmed email:",
      error.message,
    );
    return { success: false, error: error.message };
  }
};

// Send Appointment Completed Email
export const sendAppointmentCompletedEmail = async (user, appointment) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping appointment completed");
      return { success: false, message: "Email not configured" };
    }

    const htmlContent = appointmentCompletedTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Appointment Completed - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Appointment completed email sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "❌ Failed to send appointment completed email:",
      error.message,
    );
    return { success: false, error: error.message };
  }
};

// Send Admin Notification for New Booking
export const sendAdminBookingNotification = async (appointment, user) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping admin notification");
      return { success: false, message: "Email not configured" };
    }

    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
    });

    if (admins.length === 0) {
      console.log("⚠️ No admin users found to notify");
      return { success: false, message: "No admin users found" };
    }

    const adminEmails = admins.map((admin) => admin.email);
    const htmlContent = adminBookingNotificationTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: adminEmails,
      subject: "📅 New Booking Alert - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification sent to ${adminEmails.length} admins`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send admin notification:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Status Change Notification
export const sendStatusChangeNotification = async (
  user,
  appointment,
  oldStatus,
  newStatus,
) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(
        "⚠️ Email not configured - skipping status change notification",
      );
      return { success: false, message: "Email not configured" };
    }

    const htmlContent = statusChangeNotificationTemplate(
      appointment,
      user,
      oldStatus,
      newStatus,
    );

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `📋 Appointment ${newStatus} - Royale la'belle`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `📧 Status change email sent to ${user.email} (${oldStatus} → ${newStatus})`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send status change email:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Generic Email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("⚠️ Email not configured - skipping email");
      return { success: false, message: "Email not configured" };
    }

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};
