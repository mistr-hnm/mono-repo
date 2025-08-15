import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiQuery } from '@nestjs/swagger'; // Added new decorators
import { CoursesService } from './courses.service';
import {
    CreateCourseDto,
    CreateCourseResponseDto,
    UpdateCourseDto,
    UpdateCourseResponseDto,
    GetCourseResponseDto,
    GetCoursesResponseDto,
    DeleteCourseResponseDto,
    SearchCoursesDto,
} from './schemas/course.dto';
import { signture } from '../../core/meta/global.header';
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from '../../lib/global.response';


@Controller() 
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
    ) {}

    @ApiOperation({ summary: "Create a new course" })
    @ApiBody({
        description: "Course data for creation.",
        type: CreateCourseDto 
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course created successfully", type: CreateCourseResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto) { 
        return await this.courseService.create(createCourseDto);
    }

    @ApiOperation({ summary: "Get all courses" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Courses fetched successfully", type: GetCoursesResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @Get()
    async findAll(@Query() searchDto : SearchCoursesDto) {
        return await this.courseService.findAll(searchDto);
    }


    @ApiOperation({ summary: "Get course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to retrieve.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course fetched successfully", type: GetCourseResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Course not found." , type : NotFoundResponseDto })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.courseService.findById(id);
    }

    @ApiOperation({ summary: "Update course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to update.", type: String, format: 'uuid' })
    @ApiBody({
        description: "Partial course data for update.",
        type: UpdateCourseDto 
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course updated successfully", type: UpdateCourseResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Course not found." , type : NotFoundResponseDto })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) { 
        return await this.courseService.update(id, updateCourseDto);
    }

    @ApiOperation({ summary: "Delete course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to delete.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course deleted successfully", type: DeleteCourseResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Course not found." , type : NotFoundResponseDto })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.courseService.delete(id);
    }
}