import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export const signToken = (payload: { id: number; username: string }) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { id: string; username: string };
};