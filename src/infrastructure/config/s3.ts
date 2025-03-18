import {S3} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
export const s3 = new S3({
    region:'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_KEY as string,
        secretAccessKey:process.env.S3_SECRET as string 
    },
});
