import CareerProfile from "../models/CareerProfile.js";

export const saveSuggestion = async (req, res) => {
  try {
    const { name, degree, specialization, skills, experience, jobRole, aiResponse } = req.body;

    if (!name || !degree || !specialization || !skills || experience == null || !jobRole)
      return res.status(400).json({ error: "All fields are required" });

    const careerProfile = new CareerProfile({
      name,
      degree,
      specialization,
      skills: Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim()),
      experience: Number(experience),
      jobRole,
      aiResponse: aiResponse || "",
    });

    await careerProfile.save();

    res.status(201).json({ message: "✅ Suggestion saved successfully!" });
  } catch (error) {
    console.error("Save Suggestion Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const suggestions = await CareerProfile.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    console.error("Fetch Suggestions Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
