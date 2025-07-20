import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

 export class FileDto {
    @ApiProperty({ example: 'dsd5sds8dsds87d45sd9874wewed', description: "The ID of the course" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly _id?: number;

    @ApiProperty({ example: "test key", description: "The key of the file" })
    @IsString()
    @IsNotEmpty()
    readonly key: string;

    @ApiProperty({ example: "file", description: "The file" })
    @IsString()
    @IsNotEmpty()
    readonly filename: string;

    @ApiProperty({ example: "https://aws.bucketname.com/filename.jpg", description: "The url of s3 bucket" })
    @IsString()
    @IsNotEmpty()
    readonly url: string;

}
 
export class CreateFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the course creation was successful' })
    status: boolean;

    @ApiProperty({
        type : [FileDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            key: "we4324esds",
            filename: 'Image.jpg',
            url: 'https://aws.bucketname.com/filename.jpg', 
        },
        description: 'The created file data object',
    })
    data?: {
        _id: string;
        key: string;
        filename: string; 
        url : string 
    };
    @ApiProperty({ example: 'file uploaded successfully', description: 'A message detailing the outcome' })
    message: string;
}

export class GetFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'File fetched successfully', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [FileDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            key: "we4324esds",
            filename: 'Image.jpg',
            url: 'https://aws.bucketname.com/filename.jpg', 
        },
        description: 'The course data object (optional, present if success is true)',
    })
    data?: {
        _id: string;
        key: string;
        filename: string; 
        url : string 
    };
}
   
  
export class DeleteFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'File deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}