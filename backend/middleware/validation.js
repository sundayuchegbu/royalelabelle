// @desc    Validate consultation
export const validateConsultation = (req, res, next) => {
  const {
    name,
    email,
    phone,
    hairType,
    hairCondition,
    hairLength,
    hairDensity,
    preferredStyle,
    preferredDate,
    preferredTime,
  } = req.body;

  const requiredFields = [
    { field: name, label: "Name" },
    { field: email, label: "Email" },
    { field: phone, label: "Phone" },
    { field: hairType, label: "Hair Type" },
    { field: hairCondition, label: "Hair Condition" },
    { field: hairLength, label: "Hair Length" },
    { field: hairDensity, label: "Hair Density" },
    { field: preferredStyle, label: "Preferred Style" },
    { field: preferredDate, label: "Preferred Date" },
    { field: preferredTime, label: "Preferred Time" },
  ];

  const missingFields = requiredFields
    .filter(({ field }) => !field || field === "")
    .map(({ label }) => label);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `All consultation fields are required: ${missingFields.join(", ")}`,
    });
  }

  next();
};

// @desc    Validate appointment
export const validateAppointment = (req, res, next) => {
  const { serviceType, appointmentDate, consultationId } = req.body;

  if (!serviceType || !appointmentDate || !consultationId) {
    return res.status(400).json({
      success: false,
      message:
        "Service type, appointment date, and consultation ID are required",
    });
  }

  // Check if appointment date is in the future
  const date = new Date(appointmentDate);
  if (date <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date must be in the future",
    });
  }

  next();
};
