import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    IsDateString, 
    IsMongoId, 
    IsPositive, 
} from 'class-validator';
 
class StudentEnrolledCourseResponseDto {
    @ApiProperty({ example: '60c72b2f9b1e8b0015b0e4d7', description: 'The MongoDB ObjectId of the enrolled course' })
    _id: string;

    @ApiProperty({ example: 101, description: 'The unique ID of the course' })
    courseId: number; // Assuming you'd want to show this along with _id

    @ApiProperty({ example: 'Introduction to NestJS', description: 'The name of the enrolled course' })
    name: string;
    
    @ApiProperty({ example: 'Learn the fundamentals of NestJS framework.', description: 'A brief description of the course', required: false })
    description?: string;
}

 
export class CreateStudentDto {
    @ApiProperty({ example: 1001, description: "The unique enrollment number of the student" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly enrollmentNumber: number;

    @ApiProperty({ example: "Alice Wonderland", description: "The full name of the student" })
    @IsString()
    @IsNotEmpty()
    readonly fullname: string;

    @ApiProperty({ example: "2000-01-15T00:00:00.000Z", description: "The date of birth of the student (ISO 8601 format)" })
    @IsDateString()
    @IsNotEmpty()
    readonly dateofbirth: string; // Represent as ISO 8601 string for input

    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The MongoDB ObjectId of the enrolled course" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId() // Validate as a valid MongoDB ObjectId string
    readonly enrollmentCourse: string; // Send course ID as a string

    @ApiProperty({ example: "Enthusiastic new student.", description: "A brief description of the student", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: "http://example.com/profile.jpg", description: "URL to the student's profile picture", required: false })
    @IsString()
    @IsOptional()
    readonly picture?: string;
}
 
export class CreateStudentResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the student creation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            enrollmentNumber: 1001,
            fullname: 'Alice Wonderland',
            dateofbirth: '2000-01-15T00:00:00.000Z',
            enrollmentCourse: { // Simplified nested object for response
                _id: '60c72b2f9b1e8b0015b0e4d7',
                courseId: 101,
                name: 'Introduction to NestJS',
                // description: '...' // Optional
            },
            description: 'Enthusiastic new student.',
            picture: 'http://example.com/profile.jpg', 
        },
        description: 'The created student data object',
    })
    data: {
        _id: string;
        enrollmentNumber: number;
        fullname: string;
        dateofbirth: string; // ISO 8601 string
        enrollmentCourse: StudentEnrolledCourseResponseDto; // Nested DTO
        description?: string;
        picture?: string; 
    };
}
 
export class UpdateStudentDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the student to update" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string; // Assuming 'id' is the MongoDB ObjectId string

    @ApiProperty({ example: 1002, description: "The updated enrollment number of the student", required: false })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    readonly enrollmentNumber?: number;

    @ApiProperty({ example: "Alice Smith", description: "The updated full name of the student", required: false })
    @IsString()
    @IsOptional()
    readonly fullname?: string;

    @ApiProperty({ example: "2000-01-16T00:00:00.000Z", description: "The updated date of birth (ISO 8601 format)", required: false })
    @IsDateString()
    @IsOptional()
    readonly dateofbirth?: string;

    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d8", description: "The updated MongoDB ObjectId of the enrolled course", required: false })
    @IsString()
    @IsOptional()
    @IsMongoId()
    readonly enrollmentCourse?: string; // Send course ID as a string

    @ApiProperty({ example: "Updated description about the student.", description: "Additional description about the student", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: "http://example.com/new_profile.jpg", description: "Updated URL to the student's profile picture", required: false })
    @IsString()
    @IsOptional()
    readonly picture?: string;
}

// --- Update Student Response DTO ---
export class UpdateStudentResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the student update was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            enrollmentNumber: 1002,
            fullname: 'Alice Smith',
            dateofbirth: '2000-01-16T00:00:00.000Z',
            enrollmentCourse: {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                courseId: 102,
                name: 'Advanced NestJS Techniques',
                // description: '...'
            },
            description: 'Updated description about the student.',
            picture: 'http://example.com/new_profile.jpg', 
        },
        description: 'The updated student data object',
    })
    data?: {
        _id: string;
        enrollmentNumber: number;
        fullname: string;
        dateofbirth: string;
        enrollmentCourse: StudentEnrolledCourseResponseDto;
        description?: string;
        picture?: string; 
    };
    @ApiProperty({ example: 'Student not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}

// --- Get Student by ID DTO ---
export class GetStudentByIdDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the student" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;
}
 
export class GetStudentResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            enrollmentNumber: 1001,
            fullname: 'Alice Wonderland',
            dateofbirth: '2000-01-15T00:00:00.000Z',
            enrollmentCourse: {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                courseId: 101,
                name: 'Introduction to NestJS',
                // description: '...'
            },
            description: 'Enthusiastic new student.',
            picture: 'http://example.com/profile.jpg', 
        },
        description: 'The student data object (optional, present if success is true)',
        required: false,
    })
    data?: {
        _id: string;
        enrollmentNumber: number;
        fullname: string;
        dateofbirth: string;
        enrollmentCourse: StudentEnrolledCourseResponseDto;
        description?: string;
        picture?: string; 
    };

    @ApiProperty({ example: 'Student not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}
 
export class GetAllStudentsDto {
    @ApiProperty({ example: 10, description: "The number of students to retrieve per page", required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination", required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly offset?: number;
}
 
export class GetStudentsResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        type: [GetStudentResponseDto], // Array of single student response DTOs
        example: [
            {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                enrollmentNumber: 1001,
                fullname: 'Alice Wonderland',
                dateofbirth: '2000-01-15T00:00:00.000Z',
                enrollmentCourse: {
                    _id: '60c72b2f9b1e8b0015b0e4d7',
                    courseId: 101,
                    name: 'Introduction to NestJS',
                },
                description: 'Enthusiastic new student.',
                picture: 'http://example.com/profile.jpg', 
            },
            {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                enrollmentNumber: 1002,
                fullname: 'Bob The Builder',
                dateofbirth: '1999-03-20T00:00:00.000Z',
                enrollmentCourse: {
                    _id: '60c72b2f9b1e8b0015b0e4d8',
                    courseId: 102,
                    name: 'Advanced NestJS',
                },
                description: 'Loves building things.',
                picture: 'http://example.com/bob.jpg', 
            },
        ],
        description: 'An array of student data objects',
    })
    data?: {
        _id: string;
        enrollmentNumber: number;
        fullname: string;
        dateofbirth: string;
        enrollmentCourse: StudentEnrolledCourseResponseDto;
        description?: string;
        picture?: string; 
    }[];

    @ApiProperty({ example: 'No students found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}
 
export class DeleteStudentDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the student to delete" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;
} 

export class DeleteStudentResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({ example: 'Student deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}