// Welcome Email Template
export const welcomeEmailTemplate = (user, bookingLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Royale la'belle</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 32px; margin: 0; }
        .header p { color: #d4a691; font-size: 16px; margin: 10px 0 0 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .content h2 { color: #4a2b1d; font-family: Georgia, serif; font-size: 24px; margin-top: 0; }
        .content p { color: #4a2b1d; line-height: 1.6; font-size: 16px; }
        .content .highlight { background: #fdf8f6; border-left: 4px solid #c48d2c; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
        .content .highlight p { margin: 5px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%); color: #ffffff !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 15px rgba(196, 141, 44, 0.3); }
        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; }
        .feature-item { background: #fdf8f6; padding: 15px; border-radius: 8px; text-align: center; }
        .feature-item .icon { font-size: 28px; display: block; margin-bottom: 8px; }
        .feature-item h4 { color: #4a2b1d; margin: 5px 0; font-size: 14px; }
        .feature-item p { color: #7f482f; font-size: 12px; margin: 5px 0 0 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-radius: 0 0 12px 12px; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
        .footer .social-links { margin: 15px 0; }
        .footer .social-links a { margin: 0 10px; color: #7f482f; text-decoration: none; }
        @media only screen and (max-width: 480px) {
          .container { padding: 20px 10px; }
          .content { padding: 25px 20px; }
          .features { grid-template-columns: 1fr; }
          .button { display: block; text-align: center; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Royale la'belle</h1>
          <p>Loc'ed in Beauty, Rooted in Royalty</p>
        </div>
        <div class="content">
          <h2>Welcome to the Family, ${user.name}! 💛</h2>
          <p>We're absolutely thrilled to have you join the Royale la'belle community! Your journey to beautiful, healthy locs starts here.</p>
          <div class="highlight">
            <p><strong>🌟 Your Account Details:</strong></p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
          </div>
          <div style="text-align: center;">
            <a href="${bookingLink}" class="button">📅 Book Your First Appointment</a>
          </div>
          <p style="font-size: 14px; color: #7f482f; text-align: center;">Or visit our website to explore our services.</p>
          <div class="features">
            <div class="feature-item"><span class="icon">💇‍♀️</span><h4>Expert Care</h4><p>AMP certified professional</p></div>
            <div class="feature-item"><span class="icon">🌱</span><h4>Healthy Locs</h4><p>Nurturing your natural hair</p></div>
            <div class="feature-item"><span class="icon">✨</span><h4>Premium Quality</h4><p>Top-notch products & techniques</p></div>
            <div class="feature-item"><span class="icon">💛</span><h4>Personalized Service</h4><p>Tailored to your hair goals</p></div>
          </div>
          <p style="text-align: center; font-size: 16px; color: #4a2b1d;">Looking forward to locking with you! 💛<br><span style="color: #c48d2c;">- Peace Queen</span></p>
        </div>
        <div class="footer">
          <p>📍 Ketchener, Ontario<br>📞 (548) 557-3218 | 📧 info@royallabelle.com</p>
          <div class="social-links">
            <a href="https://instagram.com/royallabelle" target="_blank">Instagram</a>
            <a href="https://facebook.com/royallabelle" target="_blank">Facebook</a>
            <a href="https://youtube.com/royallabelle" target="_blank">YouTube</a>
          </div>
          <p style="font-size: 12px; color: #d4a691;">© ${new Date().getFullYear()} Royale la'belle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Booking Confirmation Email Template
export const bookingConfirmationTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Booking Confirmation - Royale la'belle</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 28px; margin: 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .content h2 { color: #4a2b1d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; }
        .details { background: #fdf8f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details p { margin: 8px 0; color: #4a2b1d; }
        .details strong { color: #7f482f; }
        .button { display: inline-block; background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%); color: #ffffff !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-radius: 0 0 12px 12px; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your appointment has been successfully booked! Please complete the payment to confirm.</p>
          <div class="details">
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>⏰ Time:</strong> ${new Date(appointment.appointmentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            <p><strong>💵 Deposit:</strong> $${appointment.depositAmount}</p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/checkout?appointmentId=${appointment._id}" class="button">💳 Pay Deposit Now</a>
          </div>
          <p style="text-align: center; font-size: 14px; color: #7f482f;">Your appointment will be confirmed after payment.</p>
        </div>
        <div class="footer">
          <p>📍 Ketchener, Ontario</p>
          <p>📞 (548) 557-3218 | 📧 info@royallabelle.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Admin Booking Notification Template
export const adminBookingNotificationTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Booking Alert</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 28px; margin: 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .alert-box { background: #fff5e6; border-left: 4px solid #c48d2c; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { background: #fdf8f6; padding: 12px 15px; border-radius: 8px; }
        .detail-item .label { font-size: 11px; color: #7f482f; text-transform: uppercase; font-weight: 600; }
        .detail-item .value { font-size: 15px; color: #4a2b1d; font-weight: 500; margin-top: 4px; }
        .customer-info { background: #f0f9ff; padding: 15px 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd; }
        .customer-info h4 { color: #0369a1; margin: 0 0 10px 0; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%); color: #ffffff !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 New Booking Alert</h1>
        </div>
        <div class="content">
          <h2>You have a new booking!</h2>
          <div class="alert-box">
            <p><strong>👤 Customer:</strong> ${user.name}</p>
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>⏰ Time:</strong> ${new Date(appointment.appointmentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <div class="customer-info">
            <h4>👤 Customer Information</h4>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
          </div>
          <div class="details-grid">
            <div class="detail-item"><div class="label">Deposit</div><div class="value">$${appointment.depositAmount}</div></div>
            <div class="detail-item"><div class="label">Total Price</div><div class="value">$${appointment.fullPrice}</div></div>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/appointments/${appointment._id}" class="button">📋 View Appointment</a>
          </div>
        </div>
        <div class="footer">
          <p>📍 Ketchener, Ontario</p>
          <p>📞 (548) 557-3218 | 📧 info@royallabelle.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Appointment Confirmed Email Template
export const appointmentConfirmedTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Appointment Confirmed</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 28px; margin: 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .content h2 { color: #4a2b1d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; }
        .confirmation-box { background: #f0fdf4; border: 2px solid #86efac; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { background: #fdf8f6; padding: 12px 15px; border-radius: 8px; }
        .detail-item .label { font-size: 11px; color: #7f482f; text-transform: uppercase; font-weight: 600; }
        .detail-item .value { font-size: 15px; color: #4a2b1d; font-weight: 500; margin-top: 4px; }
        .info-box { background: #f0f9ff; padding: 15px 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd; }
        .info-box ul { margin: 5px 0; padding-left: 20px; color: #0c4a6e; }
        .info-box li { margin: 5px 0; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%); color: #ffffff !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>✅ Appointment Confirmed!</h1></div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <div class="confirmation-box"><p>Your appointment has been successfully confirmed! 🎉</p></div>
          <div class="details-grid">
            <div class="detail-item"><div class="label">Service</div><div class="value">${serviceLabels[appointment.serviceType] || appointment.serviceType}</div></div>
            <div class="detail-item"><div class="label">Date & Time</div><div class="value">${new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${new Date(appointment.appointmentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div></div>
          </div>
          <div class="info-box"><ul><li><strong>Location:</strong> Ketchener, Ontario</li><li><strong>Arrival:</strong> Please arrive 10 minutes before</li><li><strong>Late Policy:</strong> $20 fee after 15 minutes</li></ul></div>
          <div style="text-align: center;"><a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="button">📋 View Details</a></div>
        </div>
        <div class="footer"><p>📍 Ketchener, Ontario<br>📞 (548) 557-3218 | 📧 info@royallabelle.com</p></div>
      </div>
    </body>
    </html>
  `;
};

// Appointment Completed Email Template
export const appointmentCompletedTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Appointment Completed</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 28px; margin: 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .content h2 { color: #4a2b1d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; }
        .review-box { background: #f0fdf4; border: 2px solid #86efac; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .details { background: #fdf8f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>✅ Appointment Completed</h1></div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <div class="review-box"><p>Your appointment has been marked as completed! 🎉</p></div>
          <div class="details">
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <p style="text-align: center;">We hope you loved your experience! 💛<br><span style="color: #c48d2c;">- Peace Queen</span></p>
        </div>
        <div class="footer"><p>📍 Ketchener, Ontario<br>📞 (548) 557-3218 | 📧 info@royallabelle.com</p></div>
      </div>
    </body>
    </html>
  `;
};

// Status Change Notification Template
export const statusChangeNotificationTemplate = (
  appointment,
  user,
  oldStatus,
  newStatus,
) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  const statusMessages = {
    confirmed: "Your appointment has been confirmed! 🎉",
    completed:
      "Your appointment has been completed. We hope you enjoyed your experience! 💛",
    cancelled:
      "Your appointment has been cancelled. Please contact us if you have any questions.",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Appointment Status Update</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #fdf8f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%); border-radius: 12px 12px 0 0; }
        .header h1 { color: #c48d2c; font-family: Georgia, serif; font-size: 28px; margin: 0; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1); }
        .content h2 { color: #4a2b1d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; }
        .status-box { background: #fdf8f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c48d2c; }
        .details { background: #fdf8f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 30px 20px; background: #fdf8f6; border-top: 1px solid #f6ede8; }
        .footer p { color: #7f482f; font-size: 13px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>📋 Status Update</h1></div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <div class="status-box"><p>${statusMessages[newStatus] || `Your appointment status has been updated to: ${newStatus}`}</p></div>
          <div class="details">
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>📌 Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
          </div>
          <p style="text-align: center; font-size: 14px; color: #7f482f;">Have questions? Contact us at (548) 557-3218</p>
        </div>
        <div class="footer"><p>📍 Ketchener, Ontario<br>📞 (548) 557-3218 | 📧 info@royallabelle.com</p></div>
      </div>
    </body>
    </html>
  `;
};
