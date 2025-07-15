import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HttpStatus } from "../constants/HttpStatus";
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
     return
  }
  next();
};
