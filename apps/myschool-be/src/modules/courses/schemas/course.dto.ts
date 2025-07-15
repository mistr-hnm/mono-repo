import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

// --- Create Course DTO ---
export class CreateCourseDto {
    @ApiProperty({ example: 101, description: "The unique ID of the course" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly courseId: number;

    @ApiProperty({ example: "Introduction to NestJS", description: "The name of the course" })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ example: "Learn the fundamentals of NestJS framework.", description: "A brief description of the course", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

// --- Create Course Response DTO ---
export class CreateCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the course creation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            courseId: 101,
            name: 'Introduction to NestJS',
            description: 'Learn the fundamentals of NestJS framework.', 
        },
        description: 'The created course data object',
    })
    data: {
        _id: string; // Assuming BaseSchema adds _id
        courseId: number;
        name: string;
        description?: string; 
    };
}

// --- Update Course DTO ---
export class UpdateCourseDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the course to update" })
    @IsString()
    @IsNotEmpty()
    readonly id: string; // Assuming 'id' is the MongoDB ObjectId string

    @ApiProperty({ example: 102, description: "The updated unique ID of the course", required: false })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    readonly courseId?: number;

    @ApiProperty({ example: "Advanced NestJS Techniques", description: "The updated name of the course", required: false })
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ example: "Dive deep into advanced NestJS concepts.", description: "The updated description of the course", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

// --- Update Course Response DTO ---
export class UpdateCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the course update was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            courseId: 102,
            name: 'Advanced NestJS Techniques',
            description: 'Dive deep into advanced NestJS concepts.', 
        },
        description: 'The updated course data object',
    })
    data?: {
        _id: string;
        courseId: number;
        name: string;
        description?: string; 
    };
    @ApiProperty({ example: 'User not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string; // Add an optional message property for error cases
}

// --- Get Course by ID DTO ---
export class GetCourseByIdDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the course" })
    @IsString()
    @IsNotEmpty()
    readonly id: string;
}

// --- Get Course Response DTO (for single course retrieval) ---
export class GetCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            courseId: 101,
            name: 'Introduction to NestJS',
            description: 'Learn the fundamentals of NestJS framework.', 
        },
        description: 'The course data object (optional, present if success is true)',
        required: false,
    })
    data?: {
        _id: string;
        courseId: number;
        name: string;
        description?: string; 
    };

    @ApiProperty({ example: 'Course not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}

// --- Get All Courses DTO ---
export class GetAllCoursesDto {
    @ApiProperty({ example: 10, description: "The number of courses to retrieve per page", required: false })
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

// --- Get Courses Response DTO (for listing multiple courses) ---
export class GetCoursesResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        type: [GetCourseResponseDto], // Array of single course response DTOs
        example: [
            {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                courseId: 101,
                name: 'Introduction to NestJS',
                description: 'Learn the fundamentals of NestJS framework.', 
            },
            {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                courseId: 102,
                name: 'Advanced NestJS',
                description: 'Explore advanced topics in NestJS.', 
            },
        ],
        description: 'An array of course data objects',
    })
    data?: {
        _id: string;
        courseId: number;
        name: string;
        description?: string; 
    }[];

    @ApiProperty({ example: 'No courses found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}

// --- Delete Course DTO ---
export class DeleteCourseDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the course to delete" })
    @IsString()
    @IsNotEmpty()
    readonly id: string;
}

// --- Delete Course Response DTO ---
export class DeleteCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({ example: 'Course deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}