import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min, IsEnum } from 'class-validator';
import { GetPaginationDto, PaginationDto } from '../../../lib/paginatation.util';

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

    @ApiProperty({ example: "Learn the fundamentals of NestJS framework.", description: "A brief description of the course" })
    @IsString()
    @IsOptional()
    readonly description?: string;
}
 
export class CreateCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the course creation was successful' })
    status: boolean;

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
        _id: string; 
        courseId: number;
        name: string;
        description?: string; 
    };
    @ApiProperty({ example: 'courses created successfully', description: 'A message detailing the outcome' })
    message: string;
}
 
export class UpdateCourseDto {
    
    @ApiProperty({ example: 102, description: "The updated unique ID of the course" })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    readonly courseId?: number;

    @ApiProperty({ example: "Advanced NestJS Techniques", description: "The updated name of the course" })
    @IsString()
    @IsOptional()
    readonly name?: string;

}
 
export class UpdateCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the course update was successful' })
    status: boolean;

    @ApiProperty({ example: 'courses updated successfully', description: 'A message detailing the outcome' })
    message: string;

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
 
}
 
export class GetCourseByIdDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the course" })
    @IsString()
    @IsNotEmpty()
    readonly id: string;
}

export class CourseDto {
    @ApiProperty({ example: 'dsd5sds8dsds87d45sd9874wewed', description: "The ID of the course" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly _id: number;


    @ApiProperty({ example: 101, description: "The unique ID of the course" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly courseId: number;

    @ApiProperty({ example: "Introduction to NestJS", description: "The name of the course" })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ example: "Learn the fundamentals of NestJS framework.", description: "A brief description of the course" })
    @IsString()
    @IsOptional()
    readonly description?: string;
}
 
export class GetCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'course fetched successfully', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [CourseDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            courseId: 101,
            name: 'Introduction to NestJS', 
            createdAt: new Date().toDateString(),
        },
        description: 'The course data object (optional, present if success is true)',
    })
    data?: {
        _id: string;
        courseId: number;
        name: string; 
        createdAt : string 
    };
} 

export class GetAllCoursesDto {
    @ApiProperty({ example: 10, description: "The number of courses to retrieve per page" })
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination" })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly offset?: number;
}
 
export class GetCoursesResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'courses fetched successfully', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [CourseDto],  
        example: [
            {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                courseId: 101,
                name: 'Introduction to NestJS', 
                createdAt: new Date().toDateString(),
            },
            {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                courseId: 102,
                name: 'Advanced NestJS', 
                createdAt: new Date().toDateString(),
            },
        ],
        description: 'An array of course data objects',
    })
    data?: {
        _id: string;
        courseId: number;
        name: string; 
        createdAt : string 
    }[];

    @ApiProperty({
        type: [GetPaginationDto],
        example: {
                page: 1,
                limit: 10,
                total: 10,
                totalPages: 1, 
                hasNext: false,
                hasPrev: false,
        },
        description: 'An pagination details of list',
    })
    pagination?: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        hasPrev: boolean,
    };
}
 
export class DeleteCourseDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the course to delete" })
    @IsString()
    @IsNotEmpty()
    readonly id: string;
}
 
export class DeleteCourseResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Course deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}


export enum CourseSortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export enum CourseSortField {
    CREATED_AT = 'createdAt',
    NAME = 'name',
    COURSE_ID = 'courseId'
}


export class SearchCoursesDto extends PaginationDto {
    @ApiPropertyOptional({ 
        description: "Search term for course name or courseId",
        example: "computer science" 
    })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiPropertyOptional({ 
        description: "Sort field",
        enum: CourseSortField,
        default: CourseSortField.CREATED_AT 
    })
    @IsOptional()
    @IsEnum(CourseSortField)
    sortBy?: CourseSortField = CourseSortField.CREATED_AT;

    @ApiPropertyOptional({ 
        description: "Sort order",
        enum: CourseSortOrder,
        default: CourseSortOrder.DESC 
    })
    @IsOptional()
    @IsEnum(CourseSortOrder)
    sortOrder?: CourseSortOrder = CourseSortOrder.DESC;
}

export class SearchCourseDataDto {
    @ApiProperty({ example: "60b5d5f5e4b0c8a5d8e5f5a5" })
    _id: string;

    @ApiProperty({ example: "CS101" })
    courseId: string;

    @ApiProperty({ example: "Computer Science Fundamentals" })
    name: string;

    @ApiPropertyOptional({ example: "Introduction to computer science concepts" })
    description?: string;

    @ApiProperty({ example: "Mon Jan 01 2024" })
    createdAt: string;
}
