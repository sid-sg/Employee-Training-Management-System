import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

export const login = async (req: Request, res: Response): Promise<void> => {
  if(!req.body) {
    res.status(400).json({ message: 'Request body is required' });
    return;
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only send over HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({
      // token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        path: "/",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.token;
  
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      user,
      valid: true,
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }

};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
  res.json({ message: "Logged out successfully" });
};
