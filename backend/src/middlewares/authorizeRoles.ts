import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const utilisateur = req.user;
    if (!utilisateur || !roles.includes(utilisateur.role)) {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant." });
    }
    next();
  };
};
