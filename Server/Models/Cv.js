import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    start: { type: String, required: true, trim: true },
    end: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    personal: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    summary: {
      type: String,
      trim: true,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

const Cv = mongoose.model("cvs", cvSchema);
export default Cv;

