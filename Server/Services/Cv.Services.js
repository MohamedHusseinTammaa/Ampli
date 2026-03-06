import Cv from "../Models/Cv.js";

const createCv = async (userId, payload) => {
  const cv = new Cv({
    user: userId,
    ...payload,
  });
  const saved = await cv.save();
  return saved;
};

const getMyCvs = async (userId) => {
  const cvs = await Cv.find({ user: userId }).sort({ createdAt: -1 });
  return cvs;
};

const getCvById = async (userId, id) => {
  const cv = await Cv.findOne({ _id: id, user: userId });
  return cv;
};

const updateCv = async (userId, id, payload) => {
  const updated = await Cv.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: payload },
    { new: true }
  );
  return updated;
};

const deleteCv = async (userId, id) => {
  const deleted = await Cv.findOneAndDelete({ _id: id, user: userId });
  return deleted;
};

export { createCv, getMyCvs, getCvById, updateCv, deleteCv };

