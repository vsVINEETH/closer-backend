export interface IToken {
    generateTokens(userId: string, role:string): { accessToken: string, refreshToken: string };
    verifyAccessToken(token: string): any;
}