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
        body {
          font-family: 'Arial', sans-serif;
          background-color: #fdf8f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%);
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #c48d2c;
          font-family: Georgia, serif;
          font-size: 32px;
          margin: 0;
        }
        .header p {
          color: #d4a691;
          font-size: 16px;
          margin: 10px 0 0 0;
        }
        .content {
          background: #ffffff;
          padding: 40px 30px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1);
        }
        .content h2 {
          color: #4a2b1d;
          font-family: Georgia, serif;
          font-size: 24px;
          margin-top: 0;
        }
        .content p {
          color: #4a2b1d;
          line-height: 1.6;
          font-size: 16px;
        }
        .content .highlight {
          background: #fdf8f6;
          border-left: 4px solid #c48d2c;
          padding: 15px 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .content .highlight p {
          margin: 5px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%);
          color: #ffffff !important;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          transition: opacity 0.3s;
          box-shadow: 0 4px 15px rgba(196, 141, 44, 0.3);
        }
        .button:hover {
          opacity: 0.9;
        }
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 25px 0;
        }
        .feature-item {
          background: #fdf8f6;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .feature-item .icon {
          font-size: 28px;
          display: block;
          margin-bottom: 8px;
        }
        .feature-item h4 {
          color: #4a2b1d;
          margin: 5px 0;
          font-size: 14px;
        }
        .feature-item p {
          color: #7f482f;
          font-size: 12px;
          margin: 5px 0 0 0;
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          background: #fdf8f6;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #f6ede8;
        }
        .footer p {
          color: #7f482f;
          font-size: 13px;
          margin: 5px 0;
        }
        .footer a {
          color: #c48d2c;
          text-decoration: none;
        }
        .footer .social-links {
          margin: 15px 0;
        }
        .footer .social-links a {
          margin: 0 10px;
          color: #7f482f;
          text-decoration: none;
        }
        .footer .social-links a:hover {
          color: #c48d2c;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 20px 10px;
          }
          .content {
            padding: 25px 20px;
          }
          .features {
            grid-template-columns: 1fr;
          }
          .button {
            display: block;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✨ Royale la'belle</h1>
          <p>AMP Certified Micro Locs Specialist</p>
        </div>

        <!-- Content -->
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

          <p style="font-size: 14px; color: #7f482f; text-align: center;">
            Or visit our website to explore our services.
          </p>

          <!-- Features -->
          <div class="features">
            <div class="feature-item">
              <span class="icon">💇‍♀️</span>
              <h4>Expert Care</h4>
              <p>AMP certified professional</p>
            </div>
            <div class="feature-item">
              <span class="icon">🌱</span>
              <h4>Healthy Locs</h4>
              <p>Nurturing your natural hair</p>
            </div>
            <div class="feature-item">
              <span class="icon">✨</span>
              <h4>Premium Quality</h4>
              <p>Top-notch products & techniques</p>
            </div>
            <div class="feature-item">
              <span class="icon">💛</span>
              <h4>Personalized Service</h4>
              <p>Tailored to your hair goals</p>
            </div>
          </div>

          <p style="text-align: center; font-size: 14px; color: #7f482f; border-top: 1px solid #f6ede8; padding-top: 20px; margin-top: 20px;">
            We're here to guide you every step of the way. Whether you're just starting your loc journey or maintaining your beautiful locks, we've got you covered!
          </p>

          <p style="text-align: center; font-size: 16px; color: #4a2b1d;">
            Looking forward to locking with you! 💛<br>
            <span style="color: #c48d2c;">- Zainab</span>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            📍 735 Liberty Avenue, Brooklyn, NY 11208<br>
            📞 (548) 557-3218 | 📧 info@royallabelle.com
          </p>
          
          <div class="social-links">
            <a href="https://instagram.com/royallabelle" target="_blank">Instagram</a>
            <a href="https://facebook.com/royallabelle" target="_blank">Facebook</a>
            <a href="https://youtube.com/royallabelle" target="_blank">YouTube</a>
          </div>

          <p style="font-size: 12px; color: #d4a691;">
            © ${new Date().getFullYear()} Royale la'belle. All rights reserved.
          </p>
          <p style="font-size: 11px; color: #d4a691; margin-top: 5px;">
            You received this email because you registered at Royale la'belle.
          </p>
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
      <title>Appointment Confirmation - Royale la'belle</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #fdf8f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%);
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #c48d2c;
          font-family: Georgia, serif;
          font-size: 28px;
          margin: 0;
        }
        .content {
          background: #ffffff;
          padding: 40px 30px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1);
        }
        .content h2 {
          color: #4a2b1d;
          font-family: Georgia, serif;
          font-size: 22px;
          margin-top: 0;
        }
        .details {
          background: #fdf8f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .details p {
          margin: 8px 0;
          color: #4a2b1d;
        }
        .details strong {
          color: #7f482f;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%);
          color: #ffffff !important;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          background: #fdf8f6;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #f6ede8;
        }
        .footer p {
          color: #7f482f;
          font-size: 13px;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Appointment Confirmed</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your appointment has been successfully confirmed!</p>
          
          <div class="details">
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p><strong>⏰ Time:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p><strong>📍 Location:</strong> 735 Liberty Avenue, Brooklyn, NY 11208</p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="button">View Appointment</a>
          </div>
        </div>
        <div class="footer">
          <p>📍 735 Liberty Avenue, Brooklyn, NY 11208</p>
          <p>📞 (548) 557-3218 | 📧 info@royallabelle.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Add this function to your existing emailTemplates.js

// Admin Booking Notification Template
export const adminBookingNotificationTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  const statusLabels = {
    pending: "⏳ Pending Payment",
    confirmed: "✅ Confirmed",
    completed: "✅ Completed",
    cancelled: "❌ Cancelled",
    payment_pending: "💳 Payment Pending",
    payment_verified: "✅ Payment Verified",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Notification</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #fdf8f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%);
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #c48d2c;
          font-family: Georgia, serif;
          font-size: 28px;
          margin: 0;
        }
        .header .badge {
          display: inline-block;
          background: #c48d2c;
          color: white;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          background: #ffffff;
          padding: 40px 30px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1);
        }
        .content h2 {
          color: #4a2b1d;
          font-family: Georgia, serif;
          font-size: 22px;
          margin-top: 0;
        }
        .alert-box {
          background: #fff5e6;
          border-left: 4px solid #c48d2c;
          padding: 15px 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert-box p {
          margin: 5px 0;
          color: #4a2b1d;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .detail-item {
          background: #fdf8f6;
          padding: 12px 15px;
          border-radius: 8px;
        }
        .detail-item .label {
          font-size: 11px;
          color: #7f482f;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .detail-item .value {
          font-size: 15px;
          color: #4a2b1d;
          font-weight: 500;
          margin-top: 4px;
        }
        .customer-info {
          background: #f0f9ff;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #bae6fd;
        }
        .customer-info h4 {
          color: #0369a1;
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .customer-info p {
          margin: 5px 0;
          color: #0c4a6e;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          background: #fef3c7;
          color: #92400e;
        }
        .action-button {
          display: inline-block;
          background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%);
          color: #ffffff !important;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(196, 141, 44, 0.3);
        }
        .action-button:hover {
          opacity: 0.9;
        }
        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 20px 0;
        }
        .quick-action {
          display: inline-block;
          padding: 10px 15px;
          background: #fdf8f6;
          border: 1px solid #f6ede8;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          color: #4a2b1d;
          font-size: 13px;
          transition: all 0.3s;
        }
        .quick-action:hover {
          background: #f6ede8;
          border-color: #c48d2c;
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          background: #fdf8f6;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #f6ede8;
        }
        .footer p {
          color: #7f482f;
          font-size: 13px;
          margin: 5px 0;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 20px 10px;
          }
          .content {
            padding: 25px 20px;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>📅 New Booking Alert</h1>
          <span class="badge">New Appointment</span>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>You have a new booking!</h2>
          
          <div class="alert-box">
            <p><strong>👤 Customer:</strong> ${user.name}</p>
            <p><strong>📋 Service:</strong> ${serviceLabels[appointment.serviceType] || appointment.serviceType}</p>
            <p><strong>📅 Date:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p><strong>⏰ Time:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          </div>

          <!-- Customer Information -->
          <div class="customer-info">
            <h4>👤 Customer Information</h4>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
          </div>

          <!-- Appointment Details -->
          <div class="details-grid">
            <div class="detail-item">
              <div class="label">Appointment ID</div>
              <div class="value">#${appointment._id.toString().slice(-8).toUpperCase()}</div>
            </div>
            <div class="detail-item">
              <div class="label">Status</div>
              <div class="value">
                <span class="status-badge">${statusLabels[appointment.status] || appointment.status}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="label">Deposit Amount</div>
              <div class="value">$${appointment.depositAmount}</div>
            </div>
            <div class="detail-item">
              <div class="label">Total Price</div>
              <div class="value">$${appointment.fullPrice}</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/appointments/${appointment._id}" class="action-button">
              📋 View Appointment
            </a>
          </div>

          <div class="quick-actions">
            <a href="${process.env.FRONTEND_URL}/admin/appointments" class="quick-action">
              📋 All Appointments
            </a>
            <a href="${process.env.FRONTEND_URL}/admin/dashboard" class="quick-action">
              📊 Dashboard
            </a>
            <a href="mailto:${user.email}" class="quick-action">
              ✉️ Email Customer
            </a>
            <a href="tel:${user.phone}" class="quick-action">
              📞 Call Customer
            </a>
          </div>

          <p style="text-align: center; font-size: 14px; color: #7f482f; border-top: 1px solid #f6ede8; padding-top: 20px; margin-top: 20px;">
            This is an automated notification. Please login to the admin panel for more details.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            📍 735 Liberty Avenue, Brooklyn, NY 11208<br>
            📞 (548) 557-3218 | 📧 info@royallabelle.com
          </p>
          <p style="font-size: 12px; color: #d4a691;">
            © ${new Date().getFullYear()} Royale la'belle. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Add this function to your existing emailTemplates.js

// Appointment Confirmed Email Template (sent after payment)
export const appointmentConfirmedTemplate = (appointment, user) => {
  const serviceLabels = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  const paymentMethodLabels = {
    stripe: "💳 Credit/Debit Card",
    zelle: "🏦 Zelle",
    interac: "🏦 Interac e-Transfer",
    cash: "💵 Cash",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmed - Royale la'belle</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #fdf8f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(135deg, #4a2b1d 0%, #7f482f 100%);
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #c48d2c;
          font-family: Georgia, serif;
          font-size: 28px;
          margin: 0;
        }
        .header .subtitle {
          color: #d4a691;
          font-size: 16px;
          margin: 10px 0 0 0;
        }
        .header .checkmark {
          font-size: 48px;
          display: block;
          margin-bottom: 10px;
        }
        .content {
          background: #ffffff;
          padding: 40px 30px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 20px rgba(74, 43, 29, 0.1);
        }
        .content h2 {
          color: #4a2b1d;
          font-family: Georgia, serif;
          font-size: 22px;
          margin-top: 0;
        }
        .confirmation-box {
          background: #f0fdf4;
          border: 2px solid #86efac;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .confirmation-box .big-check {
          font-size: 36px;
          display: block;
        }
        .confirmation-box p {
          color: #166534;
          font-size: 16px;
          margin: 10px 0 0 0;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .detail-item {
          background: #fdf8f6;
          padding: 12px 15px;
          border-radius: 8px;
        }
        .detail-item .label {
          font-size: 11px;
          color: #7f482f;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .detail-item .value {
          font-size: 15px;
          color: #4a2b1d;
          font-weight: 500;
          margin-top: 4px;
        }
        .info-box {
          background: #f0f9ff;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #bae6fd;
        }
        .info-box h4 {
          color: #0369a1;
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .info-box ul {
          margin: 5px 0;
          padding-left: 20px;
          color: #0c4a6e;
        }
        .info-box li {
          margin: 5px 0;
          font-size: 14px;
        }
        .info-box li strong {
          color: #0369a1;
        }
        .payment-details {
          background: #fff7ed;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #fed7aa;
        }
        .payment-details h4 {
          color: #9a3412;
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .payment-details p {
          margin: 5px 0;
          color: #78350f;
          font-size: 14px;
        }
        .action-button {
          display: inline-block;
          background: linear-gradient(135deg, #c48d2c 0%, #d6a545 100%);
          color: #ffffff !important;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(196, 141, 44, 0.3);
        }
        .action-button:hover {
          opacity: 0.9;
        }
        .quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin: 20px 0;
        }
        .quick-link {
          display: inline-block;
          padding: 10px 15px;
          background: #fdf8f6;
          border: 1px solid #f6ede8;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          color: #4a2b1d;
          font-size: 13px;
          transition: all 0.3s;
        }
        .quick-link:hover {
          background: #f6ede8;
          border-color: #c48d2c;
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          background: #fdf8f6;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #f6ede8;
        }
        .footer p {
          color: #7f482f;
          font-size: 13px;
          margin: 5px 0;
        }
        .footer .social-links {
          margin: 15px 0;
        }
        .footer .social-links a {
          margin: 0 10px;
          color: #7f482f;
          text-decoration: none;
        }
        @media only screen and (max-width: 480px) {
          .container {
            padding: 20px 10px;
          }
          .content {
            padding: 25px 20px;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .quick-links {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <span class="checkmark">✅</span>
          <h1>Appointment Confirmed!</h1>
          <p class="subtitle">Your booking is now confirmed and secured</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <div class="confirmation-box">
            <span class="big-check">🎉</span>
            <p>Your appointment has been successfully confirmed! We can't wait to see you.</p>
          </div>

          <!-- Appointment Details -->
          <h3 style="color: #4a2b1d; margin: 20px 0 10px 0;">📋 Appointment Details</h3>
          <div class="details-grid">
            <div class="detail-item">
              <div class="label">Service</div>
              <div class="value">${serviceLabels[appointment.serviceType] || appointment.serviceType}</div>
            </div>
            <div class="detail-item">
              <div class="label">Date & Time</div>
              <div class="value">${new Date(
                appointment.appointmentDate,
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })} at ${new Date(appointment.appointmentDate).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}</div>
            </div>
            <div class="detail-item">
              <div class="label">Payment Method</div>
              <div class="value">${paymentMethodLabels[appointment.paymentMethod] || appointment.paymentMethod}</div>
            </div>
            <div class="detail-item">
              <div class="label">Deposit Paid</div>
              <div class="value">$${appointment.depositAmount}</div>
            </div>
          </div>

          <!-- Important Information -->
          <div class="info-box">
            <h4>📍 Important Information</h4>
            <ul>
              <li><strong>Location:</strong> 735 Liberty Avenue, Brooklyn, NY 11208</li>
              <li><strong>Arrival Time:</strong> Please arrive <strong>10 minutes</strong> before your appointment</li>
              <li><strong>Late Policy:</strong> $20 late fee after 15 minutes. 20+ minutes results in reschedule</li>
              <li><strong>No Extra Guests:</strong> Due to limited space, we cannot accommodate additional guests</li>
            </ul>
          </div>

          <!-- Payment Details -->
          <div class="payment-details">
            <h4>💰 Payment Information</h4>
            <p><strong>Deposit Paid:</strong> $${appointment.depositAmount}</p>
            <p><strong>Remaining Balance:</strong> $${appointment.fullPrice - appointment.depositAmount}</p>
            <p style="font-size: 13px; color: #78350f; margin-top: 8px;">
              💡 Remaining balance is due on the day of service. Payment accepted via Zelle or Cash.
            </p>
          </div>

          <!-- Action Button -->
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="action-button">
              📋 View Appointment Details
            </a>
          </div>

          <!-- Quick Links -->
          <div class="quick-links">
            <a href="${process.env.FRONTEND_URL}/#services" class="quick-link">
              💇‍♀️ Our Services
            </a>
            <a href="${process.env.FRONTEND_URL}/#gallery" class="quick-link">
              📸 Gallery
            </a>
            <a href="${process.env.FRONTEND_URL}/#policy" class="quick-link">
              📋 Policy
            </a>
          </div>

          <p style="text-align: center; font-size: 14px; color: #7f482f; border-top: 1px solid #f6ede8; padding-top: 20px; margin-top: 20px;">
            We're looking forward to helping you achieve your hair goals! 💛<br>
            <span style="color: #c48d2c;">- Zainab</span>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            📍 735 Liberty Avenue, Brooklyn, NY 11208<br>
            📞 (646) 400-7132 | 📧 info@royallabelle.com
          </p>
          
          <div class="social-links">
            <a href="https://instagram.com/royallabelle" target="_blank">Instagram</a>
            <a href="https://facebook.com/royallabelle" target="_blank">Facebook</a>
            <a href="https://youtube.com/royallabelle" target="_blank">YouTube</a>
          </div>

          <p style="font-size: 12px; color: #d4a691;">
            © ${new Date().getFullYear()} Royale la'belle. All rights reserved.
          </p>
          <p style="font-size: 11px; color: #d4a691; margin-top: 5px;">
            You received this email because you booked an appointment at Royale la'belle.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
