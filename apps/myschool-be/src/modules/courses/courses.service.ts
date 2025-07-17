import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
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

        const alreadyExist = await this.courseModel.findOne({ courseId: createCourseDto.courseId }).select(["_id"]);
        if (alreadyExist) {
            throw new BadRequestException("Course with this ID already exists.");
        }

        const newCourse = new this.courseModel(createCourseDto);
        const savedCourse = await newCourse.save();

        return {
            status: true,
            message: "Course created successfully",
            data: {
                _id: savedCourse._id.toString(),
                courseId: savedCourse.courseId,
                name: savedCourse.name,
                description: savedCourse.description,
            }
        };

    }

    async findAll(): Promise<GetCoursesResponseDto> {

        const courses = await this.courseModel.find().exec();

        if (!courses || courses.length === 0) {
            throw new NotFoundException("No Course exists.");
        }

        return {
            status: true,
            message: "Courses fetched successfully",
            data: courses.map(course => ({
                _id: course._id.toString(),
                courseId: course.courseId,
                name: course.name,
                description: course.description,
            }))
        };

    }

    async findById(id: string): Promise<GetCourseResponseDto> {

        const course = await this.courseModel.findById(id).exec();

        if (!course) {
            throw new NotFoundException(`Course with ID "${id}" not found.`);
        }

        return {
            status: true,
            message: "Course fetched successfully",
            data: {
                _id: course._id.toString(),
                courseId: course.courseId,
                name: course.name,
                description: course.description,
            }
        };
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<UpdateCourseResponseDto> {

        if (updateCourseDto.courseId) {
            const existingCourseWithId = await this.courseModel.findOne({ courseId: updateCourseDto.courseId, _id: { $ne: id } }).exec();
            if (existingCourseWithId) {
                throw new BadRequestException("Another course with this courseId already exists.");
            }
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();

        if (!updatedCourse) {
            throw new NotFoundException(`Course with ID "${id}" not found for update.`);
        }

        return {
            status: true,
            message: "Course updated successfully",
            data: {
                _id: updatedCourse._id.toString(),
                courseId: updatedCourse.courseId,
                name: updatedCourse.name,
                description: updatedCourse.description,
            }
        };

    }

    async delete(id: string): Promise<DeleteCourseResponseDto> {

        const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

        if (!deletedCourse) {
            throw new NotFoundException(`Course with ID "${id}" not found for deletion.`)
        }

        return {
            status: true,
            message: `Course with ID "${id}" deleted successfully.`
        };

    }
}