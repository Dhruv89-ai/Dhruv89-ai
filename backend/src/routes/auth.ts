import { Router } from "express";
import Joi from "joi";
import { prisma } from "../lib/prisma";
import { hashPassword, signToken, verifyPassword } from "../lib/auth";

export const router = Router();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().optional(),
});

router.post("/signup", async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const existing = await prisma.user.findUnique({ where: { email: value.email } });
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await hashPassword(value.password);
  const user = await prisma.user.create({
    data: { email: value.email, passwordHash, name: value.name },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return res.status(201).json({ token, user });
});

router.post("/login", async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const user = await prisma.user.findUnique({ where: { email: value.email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await verifyPassword(value.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id, email: user.email });
  return res.json({ token, user });
});
