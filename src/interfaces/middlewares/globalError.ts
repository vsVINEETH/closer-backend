import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../domain/enums/httpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || ResponseMessages.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), 
    },
  });
};

export default errorMiddleware;
