import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/lib/response-exceptions';
import {
    CreateCourseDto,
    CreateCourseResponseDto,
    UpdateCourseDto,
    UpdateCourseResponseDto,
    GetCourseResponseDto,
    GetCoursesResponseDto,
    DeleteCourseResponseDto
} from './schemas/course.dto';

@Injectable()
export class CoursesService {

    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>
    ) { }

    async create(createCourseDto: CreateCourseDto): Promise<CreateCourseResponseDto> {
        try {
            // Check if a course with the same courseId already exists
            const alreadyExist = await this.courseModel.findOne({ courseId: createCourseDto.courseId }).select(["_id"]);
            if (alreadyExist) {
                throw new BadRequestException("Course with this ID already exists.");
            }

            const newCourse = new this.courseModel(createCourseDto);
            const savedCourse = await newCourse.save();

            return {
                success: true,
                data: {
                    _id: savedCourse._id.toString(), // Convert ObjectId to string
                    courseId: savedCourse.courseId,
                    name: savedCourse.name,
                    description: savedCourse.description,
                }
            };
        } catch (e) {
            // Re-throw if it's already a BadRequestException, otherwise wrap it
            if (e instanceof BadRequestException) {
                throw e;
            }
            throw new BadRequestException("Course creation failed.");
        }
    }

    async findAll(): Promise<GetCoursesResponseDto> {
        try {
            const courses = await this.courseModel.find().exec();

            if (!courses || courses.length === 0) {
                return {
                    success: false,
                    message: "No courses found."
                };
            }

            return {
                success: true,
                data: courses.map(course => ({
                    _id: course._id.toString(),
                    courseId: course.courseId,
                    name: course.name,
                    description: course.description,
                }))
            };
        } catch (err) {
            throw new BadRequestException("Failed to retrieve courses."); // Generic error message
        }
    }

    async findById(id: string): Promise<GetCourseResponseDto> {
        try {
            const course = await this.courseModel.findById(id).exec();

            if (!course) {
                return {
                    success: false,
                    message: `Course with ID "${id}" not found.`
                };
            }

            return {
                success: true,
                data: {
                    _id: course._id.toString(),
                    courseId: course.courseId,
                    name: course.name,
                    description: course.description,
                }
            };
        } catch (e) { 
            throw new BadRequestException(`Failed to find course with ID "${id}".`);
        }
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<UpdateCourseResponseDto> {
        try { 
            if (updateCourseDto.courseId) {
                const existingCourseWithId = await this.courseModel.findOne({ courseId: updateCourseDto.courseId, _id: { $ne: id } }).exec();
                if (existingCourseWithId) {
                    throw new BadRequestException("Another course with this courseId already exists.");
                }
            }

            const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();

            if (!updatedCourse) { 
                return {
                    success: false,
                    message: `Course with ID "${id}" not found for update.`
                };
            }

            return {
                success: true,
                data: {
                    _id: updatedCourse._id.toString(),
                    courseId: updatedCourse.courseId,
                    name: updatedCourse.name,
                    description: updatedCourse.description,
                }
            };
        } catch (e) {
            if (e instanceof BadRequestException) {
                throw e; // Re-throw custom exceptions
            }
            throw new BadRequestException(`Failed to update course with ID "${id}".`);
        }
    }

    async delete(id: string): Promise<DeleteCourseResponseDto> {
        try {
            const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

            if (!deletedCourse) {
                return {
                    success: false,
                    message: `Course with ID "${id}" not found for deletion.`
                };
            }

            return {
                success: true,
                message: `Course with ID "${id}" deleted successfully.`
            };
        } catch (e) {
            throw new BadRequestException(`Failed to delete course with ID "${id}".`);
        }
    }
}