import { Router } from "express";
import { checkSchema } from "express-validator";
import { verifyToken } from "../Middlewares/verifyToken.js";
import * as Controllers from "../Controllers/CvController.js";
import { createCvSchema, updateCvSchema } from "../Middlewares/Cv.middlewares.js";

export const router = Router();

router.post("/", verifyToken, checkSchema(createCvSchema), Controllers.createCv);
router.get("/", verifyToken, Controllers.getMyCvs);
router.get("/:id", verifyToken, Controllers.getCvById);
router.patch("/:id", verifyToken, checkSchema(updateCvSchema), Controllers.updateCv);
router.delete("/:id", verifyToken, Controllers.deleteCv);

export default router;

