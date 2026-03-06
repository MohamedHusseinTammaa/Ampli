import { validationResult } from "express-validator";
import ErrorAsyncWrapper from "../Utils/Errors/ErrorAsyncWrapper.js";
import ErrorHandler from "../Utils/Errors/Error.js";
import * as Services from "../Services/Cv.Services.js";

const createCv = ErrorAsyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler("validation Errors", 400, errors));
  }

  const userId = req.currentUser?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized", 401, "User not found in request"));
  }

  const saved = await Services.createCv(userId, req.body);

  res.status(201).json({
    success: true,
    data: saved,
  });
});

const getMyCvs = ErrorAsyncWrapper(async (req, res, next) => {
  const userId = req.currentUser?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized", 401, "User not found in request"));
  }

  const cvs = await Services.getMyCvs(userId);

  res.status(200).json({
    success: true,
    data: cvs,
  });
});

const getCvById = ErrorAsyncWrapper(async (req, res, next) => {
  const userId = req.currentUser?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized", 401, "User not found in request"));
  }

  const { id } = req.params;
  const cv = await Services.getCvById(userId, id);

  if (!cv) {
    return next(new ErrorHandler("CV not found", 404, "CV not found"));
  }

  res.status(200).json({
    success: true,
    data: cv,
  });
});

const updateCv = ErrorAsyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler("validation Errors", 400, errors));
  }

  const userId = req.currentUser?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized", 401, "User not found in request"));
  }

  const { id } = req.params;
  const updated = await Services.updateCv(userId, id, req.body);

  if (!updated) {
    return next(new ErrorHandler("CV not found", 404, "CV not found"));
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
});

const deleteCv = ErrorAsyncWrapper(async (req, res, next) => {
  const userId = req.currentUser?._id;
  if (!userId) {
    return next(new ErrorHandler("Unauthorized", 401, "User not found in request"));
  }

  const { id } = req.params;
  const deleted = await Services.deleteCv(userId, id);

  if (!deleted) {
    return next(new ErrorHandler("CV not found", 404, "CV not found"));
  }

  res.status(200).json({
    success: true,
    message: "CV deleted successfully",
  });
});

export { createCv, getMyCvs, getCvById, updateCv, deleteCv };

