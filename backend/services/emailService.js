import { Resend } from "resend";
import {
  welcomeEmailTemplate,
  bookingConfirmationTemplate,
  adminBookingNotificationTemplate,
  appointmentConfirmedTemplate,
  appointmentCompletedTemplate,
  statusChangeNotificationTemplate,
} from "../utils/emailTemplates.js";
import User from "../models/User.js";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send Welcome Email
export const sendWelcomeEmail = async (user) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

    const bookingLink = `${process.env.FRONTEND_URL || "https://royalelabelle.netlify.app"}/#booking`;
    const htmlContent = welcomeEmailTemplate(user, bookingLink);

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: user.email,
      subject: "Welcome to Royale la'belle! ✨",
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Welcome email sent to ${user.email}`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Booking Confirmation Email
export const sendBookingConfirmationEmail = async (user, appointment) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

    const htmlContent = bookingConfirmationTemplate(appointment, user);

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: user.email,
      subject: "📋 Booking Confirmation - Royale la'belle",
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Booking confirmation sent to ${user.email}`);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Failed to send booking confirmation:", error.message);
    return { success: false, error: error.message };
  }
};

// Send Appointment Confirmed Email
export const sendAppointmentConfirmedEmail = async (user, appointment) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

    const htmlContent = appointmentConfirmedTemplate(appointment, user);

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: user.email,
      subject: "✅ Appointment Confirmed - Royale la'belle",
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Appointment confirmed email sent to ${user.email}`);
    return { success: true, messageId: data?.id };
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
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

    const htmlContent = appointmentCompletedTemplate(appointment, user);

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: user.email,
      subject: "✅ Appointment Completed - Royale la'belle",
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Appointment completed email sent to ${user.email}`);
    return { success: true, messageId: data?.id };
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
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

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

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: adminEmails,
      subject: "📅 New Booking Alert - Royale la'belle",
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`📧 Admin notification sent to ${adminEmails.length} admins`);
    return { success: true, messageId: data?.id };
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
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured - skipping email");
      return { success: false, message: "RESEND_API_KEY not configured" };
    }

    const htmlContent = statusChangeNotificationTemplate(
      appointment,
      user,
      oldStatus,
      newStatus,
    );

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM || "Royale la'belle <noreply@royalelabelle.com>",
      to: user.email,
      subject: `📋 Appointment ${newStatus} - Royale la'belle`,
      html: htmlContent,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(
      `📧 Status change email sent to ${user.email} (${oldStatus} → ${newStatus})`,
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Failed to send status change email:", error.message);
    return { success: false, error: error.message };
  }
};
