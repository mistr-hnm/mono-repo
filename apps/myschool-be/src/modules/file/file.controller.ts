import { Controller, Delete, FileTypeValidator, Get, InternalServerErrorException, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiHeaders, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { signture } from 'src/core/meta/global.header';
import { FileService } from './file.service';
import { CreateFileResponseDto, DeleteFileResponseDto, GetFileResponseDto } from './schemas/file.dto';
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from 'src/lib/global.response';

@Controller()
export class FileController {

    constructor(private fileService: FileService) { }

    @ApiOperation({ summary: "Upload file" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File uploaded successfully", type: CreateFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 5 }),
                new FileTypeValidator({ fileType: 'image/(jpeg|png|gif|webp|x-jpeg|x-png)' }),
            ]
        })
    ) file: Express.Multer.File) {
        return await this.fileService.uploadFile(file)
    }


    @ApiOperation({ summary: "Get url by Key" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File fetched successfully", type: GetFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "File not found." , type : NotFoundResponseDto })
    @Get(':key')
    async getFile(@Param('key') key: string) {
        return await this.fileService.getPresignedUrl(key)
    }



    @ApiOperation({ summary: "Delete url by Key" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File deleted successfully", type: DeleteFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "File not found." , type : NotFoundResponseDto })
    @Delete(':key')
    async deleteFile(@Param('key') key: string) {
        const file = await this.fileService.findByKey(key);
        if (!file) {
            throw new NotFoundException(`File not found.`);
        }
        return await this.fileService.deleteFile(key)
    }


    // Get buffer as base64 (for frontend processing)
    @ApiOperation({ summary: "Get buffer of image" })
    @ApiHeaders([signture])
    @ApiNotFoundResponse({ description: "File not found." , type : NotFoundResponseDto })
    @ApiOkResponse({ description: "File fetched successfully" }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @Get(':id/buffer')
    async getFileBuffer(@Param('id') id: string) {
        try {
        const file = await this.fileService.findById(id);
        
        if (!file) {
            throw new NotFoundException('File not found');
        }

        const buffer = await this.fileService.getObjectBuffer(file.key);
        
        return {
            id: file._id,
            buffer: buffer.toString('base64'),
            // mimeType: file.mimeType,
            filename: file.filename,
            size: buffer.length
        };

        } catch (error) {
            console.error('Error getting file buffer:', error);
            throw new InternalServerErrorException('Failed to retrieve file');
        }
    }



}
