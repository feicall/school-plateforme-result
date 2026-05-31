import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

type JwtPayload = {
  id: number;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | null;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const payload = verifyToken(token) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};
