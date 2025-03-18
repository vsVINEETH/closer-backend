import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cuid from "cuid";
import { IS3Client } from "../../usecases/interfaces/IS3Client";
import { bucketName, s3 } from "../config/s3Client";


export class S3ClientAccessControll implements IS3Client {
    public urlExpiry : number;

    constructor(){
        this.urlExpiry = 900;
    }

    uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
        const uploadedFileName = `${cuid()}-${Date.now()}-${file.originalname}`;
        
        const params = {
            Bucket: bucketName,
            Key: uploadedFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
    
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return uploadedFileName;
    };


    retrieveFromS3 = async (fileName: string ): Promise<string> => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
        }
        const command = new GetObjectCommand(params);
    
     const url = await getSignedUrl(s3, command, { expiresIn: this.urlExpiry }); // 15 minutes
     console.log(url)
     return url;
    };

    deleteFromS3 = async (fileName: string ): Promise<void> => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
        };
    
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    };
}





