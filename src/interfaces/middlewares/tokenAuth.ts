import { Request, Response, NextFunction } from "express";
import { Token, JwtPayload, JsonWebTokenError, TokenExpiredError } from "../../infrastructure/services/Jwt";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

const token = new Token();

interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export function tokenAuth(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const accessToken = req.session.accessToken

        if (accessToken) {
            try {
              const decoded = token.verifyAccessToken(accessToken);
    
              if (typeof decoded === "object" && "userId" in decoded && "role" in decoded) {
                const userRole = decoded.role as string;
      
                // Check if the user's role is allowed
                if (!roles.includes(userRole)) {
                    res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INSUFFICIENT_ROLE_PRIVILEGE });
                    return;
                };
      
                req.user = decoded as TokenPayload;
                return next();  // Proceed to the next middleware

              } else {
                res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INVALID_TOKEN_PAYLOAD });
                return 
              };

            } catch (error) {
                if (error instanceof TokenExpiredError) {
                  console.log("Access token expired at", error.expiredAt);
                } else if (error instanceof JsonWebTokenError) {
                  res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_TOKEN_PAYLOAD });
                  return;
                } else {
                  res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INVALID_OR_EXPIRED_TOKEN });
                  return;
              }
            };
        };
  
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.UNAUTHORIZED_ACTION });
          return
        };
  
        try {
          const decoded = token.verifyRefreshToken(refreshToken);
  
          if (decoded && typeof decoded === "object" && "userId" in decoded && "role" in decoded) {
            const { userId, role } = decoded;
    
            // Check if the user's role is allowed
            if (!roles.includes(role)) {
              res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INSUFFICIENT_ROLE_PRIVILEGE });
              return
            };
    
            const { accessToken: newAccessToken } = token.generateTokens(userId, role);
            req.session.accessToken = newAccessToken;
            req.user =  decoded as TokenPayload;
    
            return next();  // Proceed to the next middleware
          } else {
            res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INVALID_REFRESH_TOKEN});
            return
          }
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_OR_EXPIRED_TOKEN });
            return;
          };
          res.status(HttpStatus.FORBIDDEN).json({ message: ResponseMessages.INVALID_REFRESH_TOKEN });
          return;
        }

      };
};
  
  
