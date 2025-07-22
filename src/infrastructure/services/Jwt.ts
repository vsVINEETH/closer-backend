import jwt, {JwtPayload, JsonWebTokenError, TokenExpiredError} from "jsonwebtoken"; 
import { IToken } from "../../usecases/interfaces/IToken";

export {JwtPayload, JsonWebTokenError, TokenExpiredError};
export class Token implements IToken {
    private readonly jwt_key: string = process.env.JWT_SECRET || " ";
    private readonly refresh_key: string = process.env.JWT_REFRESH_TOKEN || " ";
  
    generateTokens(userId: string, role: string): { accessToken: string; refreshToken: string } {
      const accessToken = jwt.sign({ userId, role }, this.jwt_key, {
        expiresIn: "15m",
      });
  
      const refreshToken = jwt.sign({ userId, role }, this.refresh_key, {
        expiresIn: "7d",
      });
  
      return { accessToken, refreshToken };
    }
  
    verifyAccessToken(token: string) {
      return jwt.verify(token, this.jwt_key);
    }
  
    verifyRefreshToken(token: string) {
      return jwt.verify(token, this.refresh_key);
    }
  }
  