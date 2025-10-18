import LogPaper from "../models/logPaperModel.js";
import path from "path";

// ✅ CREATE Log Paper
export const createLogPaper = async (req, res) => {
  try {
    console.log("📩 Incoming form data:", req.body);
    console.log("📎 Uploaded files:", req.files);

    const { date, startTime, endTime, totalHours, activity, description } = req.body;

    // ✅ Check for required fields
    if (!date || !activity || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Handle file uploads (store file paths)
    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          url: `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`,
        }))
      : [];

    // ✅ Create new log document
    const log = await LogPaper.create({
      studentId: req.user.id,
      date,
      startTime,
      endTime,
      totalHours,
      activity,
      description,
      attachments,
      status: "Pending",
    });

    res.status(201).json({
      message: "✅ Log paper created successfully",
      log,
    });
  } catch (err) {
    console.error("❌ LogPaper create error:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET Logs for Current Student
export const getMyLogPapers = async (req, res) => {
  try {
    const logs = await LogPaper.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ getMyLogPapers error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ MENTOR Verifies Log
export const verifyLogPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorComment } = req.body;

    const updated = await LogPaper.findByIdAndUpdate(
      id,
      {
        mentorId: req.user.id,
        mentorComment,
        status: "Verified",
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Log not found" });

    res.json({
      message: "✅ Log verified successfully",
      updated,
    });
  } catch (err) {
    console.error("❌ verifyLogPaper error:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ TUTOR Adds Feedback
export const addTutorFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { tutorFeedback } = req.body;

    const updated = await LogPaper.findByIdAndUpdate(
      id,
      {
        tutorFeedback,
        tutorId: req.user.id,
        status: "Reviewed",
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Log not found" });

    res.json({
      message: "✅ Tutor feedback added successfully",
      updated,
    });
  } catch (err) {
    console.error("❌ addTutorFeedback error:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET ALL Logs (Tutor or Admin)
export const getAllLogs = async (req, res) => {
  try {
    const logs = await LogPaper.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ getAllLogs error:", err);
    res.status(500).json({ error: err.message });
  }
};
