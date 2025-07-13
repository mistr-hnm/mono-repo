import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { Course } from './schemas/course.schema';
import { signture } from 'src/core/meta/global.header';
import { createCourseValidator, updateCourseValidator } from './schemas/course.validator';
import { createCourseResponseSchema, deleteCourseResponseSchema, getAllCoursesResponseSchema, getCourseResponseSchema, updateCourseResponseSchema } from './schemas/course.response';

@Controller()
export class CoursesController {
    constructor(
        private readonly courseService: CoursesService
    ) {}

    @ApiOperation({ summary: "Create a new course" })
    @ApiBody({
        description: "Course data for creation.",
        schema: createCourseValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(createCourseResponseSchema[200])
    @ApiResponse(createCourseResponseSchema[401])
    @Post()
    create(@Body() course: Course) {
        return this.courseService.create(course);
    }

    @ApiOperation({ summary: "Get all courses" })
    @ApiHeaders([signture])
    @ApiResponse(getAllCoursesResponseSchema[200])
    @ApiResponse(getAllCoursesResponseSchema[401])
    @Get()
    findAll() {
        return this.courseService.findAll();
    }

    @ApiOperation({ summary: "Get course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to retrieve.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(getCourseResponseSchema[200])
    @ApiResponse(getCourseResponseSchema[401])
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.courseService.findById(id);
    }

    @ApiOperation({ summary: "Update course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to update.", required: true })
    @ApiBody({
        description: "Partial course data for update.",
        schema: updateCourseValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(updateCourseResponseSchema[200])
    @ApiResponse(updateCourseResponseSchema[401])
    @ApiResponse({ status: 404, description: "Course not found." })
    @Put(':id')
    update(@Param('id') id: string, @Body() course: Partial<Course>) {
        return this.courseService.update(id, course);
    }

    @ApiOperation({ summary: "Delete course by ID" })
    @ApiParam({ name: 'id', description: "ID of the course to delete.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(deleteCourseResponseSchema[200])
    @ApiResponse(deleteCourseResponseSchema[401])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.courseService.delete(id);
    }
}