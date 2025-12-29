import { Request, Response } from "express";
import { db } from "../services/db.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, role, contact_info } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const [result] = await db.execute(
      "INSERT INTO users (name, role, contact_info) VALUES (?, ?, ?)",
      [name, role, contact_info || null]
    );

    return res.status(201).json({
      message: "User created successfully",
      userId: (result as any).insertId
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error.message
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT id, name, role, contact_info, created_at FROM users WHERE id = ?",
      [id]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json((rows as any)[0]);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error.message
    });
  }
};
