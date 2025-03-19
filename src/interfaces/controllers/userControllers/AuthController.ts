import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";

//useCase's
import { LogUser } from "../../../usecases/usecases/user/LogUseCase";
import { SignupUser } from "../../../usecases/usecases/user/SignupUseCase";
import { Security } from "../../../usecases/usecases/user/SecurityUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

//external services
import { Token } from "../../../infrastructure/services/Jwt";
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";
import { Mailer } from "../../../infrastructure/services/Mailer";
import { OTP } from "../../../infrastructure/services/Otp";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class UserAuthController {
    private logUseCase: LogUser;
    private signupUseCase: SignupUser;
    private securityUseCase: Security;

    constructor(){
        const bcrypt = new Bcrypt();
        const mailer = new Mailer();
        const otp = new OTP();
        const token = new Token();
        const userRepository = new UserRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        this.logUseCase = new LogUser(userRepository, token, bcrypt, s3ClientAccessControll);
        this.signupUseCase = new SignupUser( userRepository, mailer, bcrypt, otp, token, s3ClientAccessControll);
        this.securityUseCase = new Security(userRepository, bcrypt, otp, mailer, s3ClientAccessControll)
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const { user, tokens, status } = await this.logUseCase.login(email, password);
    
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
        const { user, tokens, status } = await this.logUseCase.loginAuth(name, email);
    
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
        const userDTO = await this.signupUseCase.signup({
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
        const verifyDTO = await this.signupUseCase.verifyOTP({ email, otp });
    
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
        const result = await this.signupUseCase.resendOTP(email);
    
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
        
          //const image = imageFiles.map((file) => file.location);
          const setupAccountData =  req.body;
          const { user, tokens } = await this.signupUseCase.setupAccount(setupAccountData, imageFiles);
    
        if (user && tokens) {
          req.session.accessToken = tokens.accessToken;
          res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
          res.status(HttpStatus.OK).json({message:ResponseMessages.ACCOUNT_CREATED_SUCCESSFULLY , user});
        } else {
          res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: ResponseMessages.FAILED_TO_UPDATE});
        }
      } catch (error) {
        next(error)
      }
    
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
      try {
  
        const userId = req.body.id;
        const newPasswordData = req.body.formData;
        const result = await this.securityUseCase.changePassword(userId, newPasswordData);
    
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
        const result = await this.securityUseCase.forgotPassword(forgotPasswordData);
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
        const result = await this.securityUseCase.verifyOTP({email, otp})
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
       const result = await this.securityUseCase.resendOTP(email);
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