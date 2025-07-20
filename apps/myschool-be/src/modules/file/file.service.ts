import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CreateFileResponseDto, DeleteFileResponseDto, FileDto, GetFileResponseDto } from './schemas/file.dto';
import { File, FileDocument } from './schemas/file.schema'


@Injectable()
export class FileService {
    private readonly s3Client: S3Client
    private readonly s3BucketName: string
    private readonly s3Region: string

    constructor(
        private readonly configService: ConfigService,
        @InjectModel(File.name) private fileModel: Model<FileDocument>
    ) {
        this.s3BucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
        this.s3Region = this.configService.getOrThrow<string>('S3_REGION');

        this.s3Client = new S3Client({
            region: this.s3Region,
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
                secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
            },
        })
    }

    async uploadFile(file: Express.Multer.File, isPublic: boolean = false): Promise<CreateFileResponseDto> {

        const filename = file.originalname.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
        const fileKey = `${Date.now()}-${filename}`;

        const uploadParams: any = {
            Bucket: this.s3BucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: isPublic ? 'public-read' : 'private',
        };

        try {
            const uploader = new Upload({
                client: this.s3Client,
                params: uploadParams
            })
            await uploader.done()
            const fileUrl = `https://${this.s3BucketName}.s3.${this.s3Region}.amazonaws.com/${fileKey}`

            const createFile: FileDto = {
                filename: filename,
                key: fileKey,
                url: fileUrl
            }
            const newFile = new this.fileModel(createFile)
            const savedFile = await newFile.save()

            if (!savedFile._id) {
                throw new BadRequestException(`File uploads failed.`);
            }

            return {
                status: true,
                message: 'File uploaded successfully',
                data: {
                    key: fileKey,
                    url: fileUrl,
                    filename: filename,
                    _id: savedFile._id.toString(),
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to upload file to S3')
        }
    }

      // Defaults to 3600 (1 hour)
      async getPresignedUrl(key: string, expiresInSeconds: number = 3600): Promise<GetFileResponseDto> {
        const command = new GetObjectCommand({
            Bucket: this.s3BucketName,
            Key: key,
        });

        try {

            const file = await this.fileModel.findOne({ key: key })

            if (!file) {
                throw new NotFoundException(`File not found.`)
            }

            const presignedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: expiresInSeconds,
            });
            const url = new URL(presignedUrl)  //@todo : getting pre-sign
            return {
                status: true,
                message: 'File fetched successfully',
                data: {
                    key: key,
                    url: url.toString(),
                    filename: file?.filename,
                    _id: file?._id.toString(),
                }
            }
        } catch (error) {
            throw new InternalServerErrorException('Failed to generate secure file URL')
        }
    }

    async deleteFile(key: string): Promise<DeleteFileResponseDto> {
        const deleteParams = {
            Bucket: this.s3BucketName,
            Key: key,
        }

        try {
            const file = await this.fileModel.findOne({ key: key })

            if (!file) {
                throw new NotFoundException(`File not found.`);
            }

            const command = new DeleteObjectCommand(deleteParams)
            await this.s3Client.send(command)

            await this.fileModel.findOneAndDelete({ key: key })
            return {
                status: true,
                message: 'File deleted successfully.'
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete file')
        }
    }

  
}