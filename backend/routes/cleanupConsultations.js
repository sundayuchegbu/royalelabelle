import mongoose from "mongoose";
import dotenv from "dotenv";
import Consultation from "../models/Consultation.js";
import Appointment from "../models/Appointment.js";

dotenv.config();

const cleanupConsultations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all active consultations
    const activeConsultations = await Consultation.find({ status: "active" });
    console.log(`Found ${activeConsultations.length} active consultations`);

    let fixedCount = 0;
    let expiredCount = 0;
    let keptCount = 0;

    for (const consultation of activeConsultations) {
      // Check if there's an associated active appointment
      const activeAppointment = await Appointment.findOne({
        consultationId: consultation._id,
        status: {
          $in: ["pending", "confirmed", "payment_pending", "payment_verified"],
        },
      });

      if (!activeAppointment) {
        // No active appointment found, set consultation to 'expired'
        consultation.status = "expired";
        await consultation.save();
        expiredCount++;
        console.log(
          `  - Consultation ${consultation._id} set to expired (no active appointment)`,
        );
      } else {
        // Has active appointment, keep as active
        keptCount++;
        console.log(
          `  - Consultation ${consultation._id} kept as active (has appointment ${activeAppointment._id})`,
        );
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`  - Set to expired: ${expiredCount} consultations`);
    console.log(`  - Kept as active: ${keptCount} consultations`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    process.exit(1);
  }
};

cleanupConsultations();
