import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


import bcrypt from "bcryptjs";

// Create user (Tutor-only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password, role are required" });
    }
    if (!["Student", "Mentor", "Tutor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hash, role }
    });

    const { password: _, ...safe } = user;
    return res.status(201).json({ message: "User created", user: safe });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

// Get users by role (?role=Student|Mentor|Tutor) or all if omitted
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.json(users);
  } catch (err) {
    console.error("getUsersByRole error:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Map mentor ↔ student (Tutor-only)
export const mapMentorToStudent = async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;
    if (!mentorId || !studentId) {
      return res.status(400).json({ error: "mentorId and studentId are required" });
    }

    const mentor = await prisma.user.findUnique({ where: { id: Number(mentorId) } });
    const student = await prisma.user.findUnique({ where: { id: Number(studentId) } });

    if (!mentor || mentor.role !== "Mentor") {
      return res.status(400).json({ error: "mentorId must refer to a Mentor" });
    }
    if (!student || student.role !== "Student") {
      return res.status(400).json({ error: "studentId must refer to a Student" });
    }

    const mapping = await prisma.mentorStudentMap.upsert({
      where: { mentorId_studentId: { mentorId: Number(mentorId), studentId: Number(studentId) } },
      update: {}, // idempotent
      create: { mentorId: Number(mentorId), studentId: Number(studentId) },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        student: { select: { id: true, name: true, email: true } },
      }
    });

    return res.status(201).json({ message: "Mapped", mapping });
  } catch (err) {
    console.error("mapMentorToStudent error:", err);
    return res.status(500).json({ error: "Failed to map mentor and student" });
  }
};

// List mappings (optionally filter by mentorId or studentId)
export const getMappings = async (req, res) => {
  try {
    const { mentorId, studentId } = req.query;
    const where = {};
    if (mentorId) where.mentorId = Number(mentorId);
    if (studentId) where.studentId = Number(studentId);

    const mappings = await prisma.mentorStudentMap.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        student: { select: { id: true, name: true, email: true } },
      }
    });

    return res.json(mappings);
  } catch (err) {
    console.error("getMappings error:", err);
    return res.status(500).json({ error: "Failed to fetch mappings" });
  }
};

// Unmap (Tutor-only)
export const unmapMentorFromStudent = async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;
    if (!mentorId || !studentId) {
      return res.status(400).json({ error: "mentorId and studentId are required" });
    }

    await prisma.mentorStudentMap.delete({
      where: { mentorId_studentId: { mentorId: Number(mentorId), studentId: Number(studentId) } },
    });

    return res.json({ message: "Unmapped" });
  } catch (err) {
    console.error("unmapMentorFromStudent error:", err);
    return res.status(500).json({ error: "Failed to unmap mentor and student" });
  }
};

