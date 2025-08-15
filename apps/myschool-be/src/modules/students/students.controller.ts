import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger'; // Added specific ApiResponse decorators
import { StudentsService } from './students.service'; 
import {
    CreateStudentDto,
    CreateStudentResponseDto,
    UpdateStudentDto,
    UpdateStudentResponseDto, 
    GetStudentResponseDto, 
    GetStudentsResponseDto, 
    DeleteStudentResponseDto,
    SearchStudentsDto
} from './schemas/student.dto'; 
import { signture } from 'src/core/meta/global.header'; 
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from 'src/lib/global.response';
import { PaginationDto } from 'src/lib/paginatation.util';

@Controller()
export class StudentsController {
    constructor(
        private readonly studentService: StudentsService
    ) {}

    @ApiOperation({ summary: "Create a new student" })
    @ApiBody({
        description: "Student data for creation.",
        type: CreateStudentDto  
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Student created successfully", type: CreateStudentResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @Post()
    async create(@Body() createStudentDto: CreateStudentDto) { 
        return await this.studentService.create(createStudentDto);
    }

    @ApiOperation({ summary: "Get all students" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Students fetched successfully", type: GetStudentsResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @Get()
    async findAll(@Query() searchStudentsDto : SearchStudentsDto) {
        return await this.studentService.findAll(searchStudentsDto);
    }

    @ApiOperation({ summary: "Get student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to retrieve.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Student fetched successfully", type: GetStudentResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Student not found." , type : NotFoundResponseDto })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.studentService.findById(id);
    }

    @ApiOperation({ summary: "Update student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to update.", type: String, format: 'uuid' }) 
    @ApiBody({
        description: "Partial student data for update.",
        type: UpdateStudentDto
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Student updated successfully", type: UpdateStudentResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Student not found." , type : NotFoundResponseDto }) 
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) { 
        return await this.studentService.update(id, updateStudentDto);
    }

    @ApiOperation({ summary: "Delete student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to delete.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Student deleted successfully", type: DeleteStudentResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Student not found." , type : NotFoundResponseDto })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.studentService.delete(id);
    }
}