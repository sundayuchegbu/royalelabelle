import nodemailer from "nodemailer";
import {
  welcomeEmailTemplate,
  bookingConfirmationTemplate,
  adminBookingNotificationTemplate,
  appointmentConfirmedTemplate, // Add this import
} from "../utils/emailTemplates.js";
import User from "../models/User.js";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send Welcome Email
export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    const bookingLink = `${process.env.FRONTEND_URL}/#booking`;

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
    console.error("❌ Failed to send welcome email:", error);
    return { success: false, error: error.message };
  }
};

// Send Booking Confirmation Email (to customer)
export const sendBookingConfirmationEmail = async (user, appointment) => {
  try {
    const transporter = createTransporter();
    const htmlContent = bookingConfirmationTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Appointment Confirmed - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Booking confirmation sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send booking confirmation:", error);
    return { success: false, error: error.message };
  }
};

// Send Appointment Confirmed Email (after payment)
export const sendAppointmentConfirmedEmail = async (user, appointment) => {
  try {
    const transporter = createTransporter();
    const htmlContent = appointmentConfirmedTemplate(appointment, user);

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Royale la'belle" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Your Appointment is Confirmed - Royale la'belle",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Appointment confirmed email sent to ${user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send appointment confirmed email:", error);
    return { success: false, error: error.message };
  }
};

// Send Admin Notification for New Booking
export const sendAdminBookingNotification = async (appointment, user) => {
  try {
    const transporter = createTransporter();

    // Get all admin users
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
    console.error("❌ Failed to send admin notification:", error);
    return { success: false, error: error.message };
  }
};

// Send Generic Email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();

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
    console.error("❌ Failed to send email:", error);
    return { success: false, error: error.message };
  }
};
