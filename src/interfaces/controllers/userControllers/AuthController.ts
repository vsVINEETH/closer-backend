import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";
import { logUserUseCase, signupUserUseCase, securityUserUseCase } from "../../../di/user.di";

export class UserAuthController {

    constructor(
      private _logUseCase = logUserUseCase,
      private _signupUseCase = signupUserUseCase,
      private _securityUseCase = securityUserUseCase,
    ){}

    login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const { user, tokens, status } = await this._logUseCase.login(email, password);
    
        if (user && tokens) {
          req.session.accessToken = tokens.accessToken;
          res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
          res.status(HttpStatus.OK).json({ user: user });
          return;
        }else if (status === null){
          res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.USER_NOT_FOUND});
          return;
        }else if(status){
          res.status(HttpStatus.FORBIDDEN).json({message: ResponseMessages.ENTRY_RESTRICTED});
          return;
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_CREDENTIALS });
          return
        }
      } catch (error) {
        next(error);
      }
    };

    loginAuth = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email } = req.body;
        const { user, tokens, status } = await this._logUseCase.loginAuth(name, email);
    
        if (user && tokens) {
          req.session.userAccessToken = tokens.accessToken;
          res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
          res.status(HttpStatus.OK).json({ user: user });
        } else if(status){
          res.status(HttpStatus.FORBIDDEN).json({message: ResponseMessages.UNAUTHORIZED_ACTION})
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_CREDENTIALS });
          return
        }
      } catch (error) {
        next(error);
      }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
          req.session.accessToken = null;
          res.clearCookie("refreshToken", { ...setCookieOptions, maxAge: 0 });
          res.status(HttpStatus.ACCEPTED).json({ message: ResponseMessages.LOGGED_OUT});
        } catch (error) {
          next(error)
        }
    };
    
    signup = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, email, password, phone } = req.body;
        const userDTO = await this._signupUseCase.signup({
          username,
          email,
          password,
          phone,
        });
    
        if (userDTO) {
          res.status(HttpStatus.ACCEPTED).json(userDTO);
          return;
        } else {
          res.status(HttpStatus.CONFLICT).json({ message: ResponseMessages.ID_ALREADY_TAKEN});
          return;
        }
      } catch (error) {
        next(error)
      }
    };

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, otp } = req.body;
        const verifyDTO = await this._signupUseCase.verifyOTP({ email, otp });
    
        if (verifyDTO) {
          res.status(HttpStatus.OK).json({message: ResponseMessages.OTP_VERIFIED_SUCCESSFULLY, verifyDTO});
          return;
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_VERIFY_OTP });
          return;
        }
      } catch (error) {
        next(error)
      }
    
    };
    
    resendOTP = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const result = await this._signupUseCase.resendOTP(email);
    
        if (result) {
          res.status(HttpStatus.OK).json({ message: ResponseMessages.OTP_SHARED_SUCCESSFULLY});
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_SHARE_OTP});
        }
      } catch (error) {
        next(error)
      }
    
    };

   setupAccount = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const imageFiles = req.files && "images" in req.files
           ? (req.files as { images: Express.Multer.File[] }).images
           : [];
        
          const setupAccountData =  req.body;
          console.log(setupAccountData,'koko')
          const { user, tokens } = await this._signupUseCase.setupAccount(setupAccountData, imageFiles);
    
        if (user && tokens) {
          req.session.accessToken = tokens.accessToken;
          res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
          res.status(HttpStatus.OK).json({message:ResponseMessages.ACCOUNT_CREATED_SUCCESSFULLY , user});
        } else {
          res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: ResponseMessages.FAILED_TO_UPDATE});
        }
      } catch (error) {
        next(error);
      };
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.body.id;
        const newPasswordData = req.body.formData;
        const result = await this._securityUseCase.changePassword(userId, newPasswordData);
    
        if (result) {
          res.status(HttpStatus.OK).json({ message: ResponseMessages.UPDATED_SUCCESSFULLY });
          return
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: ResponseMessages.INVALID_CREDENTIALS});
        return;
      } catch (error) {
        next(error)
      }
    
    };


     forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const forgotPasswordData = req.body.formData;
        const result = await this._securityUseCase.forgotPassword(forgotPasswordData);
        if(result){
          res.status(HttpStatus.OK).json({message: ResponseMessages.OTP_SHARED_SUCCESSFULLY});
          return
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.INVALID_ID});
        return
      } catch (error) {
        next(error)
      }
    };

    forgotVerify = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {email, otp} = req.body;
        const result = await this._securityUseCase.verifyOTP({email, otp})
        if(result){
          res.status(HttpStatus.ACCEPTED).json({message: ResponseMessages.OTP_VERIFIED_SUCCESSFULLY});
          return;
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_VERIFY_OTP});
        return;
      } catch (error) {
        next(error)
      }
    }

    forgotResend = async(req: Request, res: Response, next: NextFunction) => {
      try {
        const {email} = req.body;
       const result = await this._securityUseCase.resendOTP(email);
       if(result){
        res.status(HttpStatus.OK).json({message: ResponseMessages.OTP_SHARED_SUCCESSFULLY});
        return;
       }
       res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_SHARE_OTP});
       return;
      } catch (error) {
        next(error)
      }
    }
};

export const userAuthController = new UserAuthController();