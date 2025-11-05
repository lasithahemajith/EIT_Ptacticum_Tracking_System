import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Add Attendance (Prevent duplicate for same day)
export const addAttendance = async (req, res) => {
  try {
    const { type, attended, reason } = req.body;
    const studentId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 🔍 Check for existing attendance for today
    const existing = await prisma.attendance.findFirst({
      where: {
        studentId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already submitted attendance for today." });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        type,
        attended,
        reason: attended === "No" ? reason : null,
      },
    });

    res.status(201).json({
      message: "✅ Attendance recorded successfully!",
      attendance,
    });
  } catch (err) {
    console.error("❌ addAttendance error:", err);
    res.status(500).json({ error: "Failed to record attendance" });
  }
};

// ✅ Get student's attendance history
export const getMyAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (err) {
    console.error("❌ getMyAttendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance history" });
  }
};
