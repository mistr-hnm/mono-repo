import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'; // Added new decorators
import { CoursesService } from './courses.service';
// Import the Course DTOs
import {
    CreateCourseDto,
    CreateCourseResponseDto,
    UpdateCourseDto,
    UpdateCourseResponseDto,
    GetCourseResponseDto,
    GetCoursesResponseDto,
    DeleteCourseResponseDto
} from './schemas/course.dto';
import { signture } from 'src/core/meta/global.header';

@Controller() 
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
    ) {}

    @ApiOperation({ summary: "Create a new course" })
    @ApiBody({
        description: "Course data for creation.",
        type: CreateCourseDto // Use the DTO type directly
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course created successfully", type: CreateCourseResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto) { // Use the DTO for the body
        return await this.courseService.create(createCourseDto);
    }

    @ApiOperation({ summary: "Get all courses" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Courses fetched successfully", type: GetCoursesResponseDto }) // Use type for DTOs
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    // You can add @ApiQuery for GetAllCoursesDto if you want to support pagination/filters
    // @ApiQuery({ type: GetAllCoursesDto, required: false })
    @Get()
    async findAll() { // If you plan to add pagination/filters later, consider adding @Query() params
        return await this.courseService.findAll();
    }

    @ApiOperation({ summary: "Get course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to retrieve.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course fetched successfully", type: GetCourseResponseDto }) // Use type for DTOs
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.courseService.findById(id);
    }

    @ApiOperation({ summary: "Update course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to update.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiBody({
        description: "Partial course data for update.",
        type: UpdateCourseDto // Use the DTO type directly
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course updated successfully", type: UpdateCourseResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Course not found." }) // Keep custom 404
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) { // Use the DTO for the body
        return await this.courseService.update(id, updateCourseDto);
    }

    @ApiOperation({ summary: "Delete course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to delete.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Course deleted successfully", type: DeleteCourseResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.courseService.delete(id);
    }
}