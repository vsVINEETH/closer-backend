import {  S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();
export const bucketName = 'closer-uploads'
export const region  = 'ap-south-1'
export const s3 = new S3Client ({
    region:region ,
    credentials: {
        accessKeyId: process.env.AWS_S3_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET as string
    },

});
