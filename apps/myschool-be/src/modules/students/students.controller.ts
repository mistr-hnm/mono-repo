import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { Student } from './schemas/student.schema';
import { signture } from 'src/core/meta/global.header';
import { createStudentValidator,updateStudentValidator  } from './schemas/student.validator';
import { createStudentResponseSchema, deleteStudentResponseSchema, getAllStudentsResponseSchema, getStudentResponseSchema, updateStudentResponseSchema } from './schemas/student.response';

@Controller()
export class StudentsController {
    constructor(
        private readonly studentService: StudentsService
    ) {}

    @ApiOperation({ summary: "Create a new student" })
    @ApiBody({
        description: "Student data for creation.",
        schema: createStudentValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(createStudentResponseSchema[200])
    @ApiResponse(createStudentResponseSchema[401])
    @Post()
    create(@Body() student: Student) {
        return this.studentService.create(student);
    }

    @ApiOperation({ summary: "Get all students" })
    @ApiHeaders([signture])
    @ApiResponse(getAllStudentsResponseSchema[200])
    @ApiResponse(getAllStudentsResponseSchema[401])
    @Get()
    findAll() {
        return this.studentService.findAll();
    }

    @ApiOperation({ summary: "Get student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to retrieve.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(getStudentResponseSchema[200])
    @ApiResponse(getStudentResponseSchema[401])
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.studentService.findById(id);
    }

    @ApiOperation({ summary: "Update student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to update.", required: true })
    @ApiBody({
        description: "Partial student data for update.",
        schema: updateStudentValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(updateStudentResponseSchema[200])
    @ApiResponse(updateStudentResponseSchema[401])
    @ApiResponse({ status: 404, description: "Student not found." })
    @Put(':id')
    update(@Param('id') id: string, @Body() course: Partial<Student>) {
        return this.studentService.update(id, course);
    }

    @ApiOperation({ summary: "Delete student by ID" })
    @ApiParam({ name: 'id', description: "ID of the student to delete.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(deleteStudentResponseSchema[200])
    @ApiResponse(deleteStudentResponseSchema[401])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.studentService.delete(id);
    }
}