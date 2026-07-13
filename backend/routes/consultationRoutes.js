import express from "express";
import authMiddleware from "../middleware/auth.js";
import { validateConsultation } from "../middleware/validation.js";
import {
  createConsultation,
  getMyConsultation,
} from "../controllers/consultationController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateConsultation, createConsultation);
router.get("/me", getMyConsultation);

export default router;
