import TutorFeedback from "../models/tutorFeedbackModel.js";
import LogPaper from "../models/logPaperModel.js";

// ✅ Add tutor feedback (saved separately)
export const addTutorFeedback = async (req, res) => {
  try {
    const { id } = req.params; // LogPaper ID
    const { feedback } = req.body;

    // Create tutor feedback entry
    const savedFeedback = await TutorFeedback.create({
      logPaperId: id,
      tutorId: req.user.id,
      studentId: req.user.id, // or populate from log if you want correct student ID
      feedback,
    });

    // Update LogPaper to mark as Reviewed
    await LogPaper.findByIdAndUpdate(id, {
      tutorFeedback: feedback,
      tutorId: req.user.id,
      status: "Reviewed",
      reviewedAt: new Date(),
    });

    res.status(201).json({
      message: "✅ Tutor feedback saved and log marked as Reviewed",
      savedFeedback,
    });
  } catch (err) {
    console.error("❌ addTutorFeedback error:", err);
    res.status(500).json({ error: "Failed to add tutor feedback" });
  }
};

// ✅ Get all tutor feedback for a single log
export const getTutorFeedbacks = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await TutorFeedback.find({ logPaperId: id }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ getTutorFeedbacks error:", err);
    res.status(500).json({ error: "Failed to fetch tutor feedbacks" });
  }
};

// ✅ Get all tutor feedbacks (admin/tutor summary view)
export const getAllTutorFeedbacks = async (req, res) => {
  try {
    const feedbacks = await TutorFeedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ getAllTutorFeedbacks error:", err);
    res.status(500).json({ error: "Failed to fetch all tutor feedbacks" });
  }
};
