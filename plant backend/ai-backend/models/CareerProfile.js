import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: String,
    degree: String,
    specialization: String,
    skills: [String],
    experience: Number,
    jobRole: String,
    aiResponse: String,
  },
  { timestamps: true }
);

const CareerProfile = mongoose.model("CareerProfile", careerSchema);

export default CareerProfile;
