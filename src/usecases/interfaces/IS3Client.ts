export interface IS3Client {
    urlExpiry: number;
    uploadToS3 (file: Express.Multer.File): Promise<string>
    retrieveFromS3 (fileName: string ): Promise<string>
    deleteFromS3 (fileName: string ): Promise<void>
}