import { Request, Response, NextFunction } from "express";
import { Token, JwtPayload } from "../../infrastructure/services/Jwt";

const token = new Token();

interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export function tokenAuth(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {

        const accessToken = req.session.accessToken

        if (accessToken) {
          const decoded = token.verifyAccessToken(accessToken);
  
          if (typeof decoded === "object" && "userId" in decoded && "role" in decoded) {
            const userRole = decoded.role as string;
  
            // Check if the user's role is allowed
            if (!roles.includes(userRole)) {
               res.status(403).json({ message: "Forbidden: Insufficient role privileges" });
               return
            }
  
            req.user = decoded as TokenPayload;
            console.log(req.user);
            return next();  // Proceed to the next middleware
          } else {
            res.status(403).json({ message: "Invalid token payload" });
            return 
          }
        }
  
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          res.status(401).json({ message: "Unauthorized, please login" });
          return
        }
  
        const decoded = token.verifyRefreshToken(refreshToken);
  
        if (decoded && typeof decoded === "object" && "userId" in decoded && "role" in decoded) {
          const { userId, role } = decoded;
  
          // Check if the user's role is allowed
          if (!roles.includes(role)) {
             res.status(403).json({ message: "Forbidden: Insufficient role privileges" });
             return
          }
  
          const { accessToken: newAccessToken } = token.generateTokens(userId, role);
          req.session.accessToken = newAccessToken;
          req.user =  decoded as TokenPayload;
  
          return next();  // Proceed to the next middleware
        } else {
          res.status(403).json({ message: "Invalid refresh token payload" });
          return
        }
      } catch (error) {
       res.status(403).json({ message: "Invalid or expired token, please login again" });
       return 
      }
    };
  }
  
