import { Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiHeaders, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { signture } from 'src/core/meta/global.header';
import { FileService } from './file.service';
import { CreateFileResponseDto, DeleteFileResponseDto, GetFileResponseDto } from './schemas/file.dto';
import { BadRequestResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from 'src/lib/global.response';

@Controller()
export class FileController {

    constructor(private fileService: FileService) { }

    @ApiOperation({ summary: "Upload file" })
    @Post()
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File uploaded successfully", type: CreateFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @UseInterceptors(FileInterceptor('file'))
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
    @Get(':key')
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File fetched successfully", type: GetFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "File not found." , type : NotFoundResponseDto })
    async getFile(@Param('key') key: string) {
        return await this.fileService.getPresignedUrl(key)
    }



    @ApiOperation({ summary: "Delete url by Key" })
    @Delete(':key')
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "File deleted successfully", type: DeleteFileResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "File not found." , type : NotFoundResponseDto })
    async deleteFile(@Param('key') key: string) {
        return await this.fileService.deleteFile(key)
    }




}
