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
    DeleteCourseResponseDto,
    SearchCoursesDto,
    CourseSortField,
    CourseSortOrder
} from './schemas/course.dto';
import { PaginationDto, PaginationResult, PaginationUtil } from 'src/lib/pagintation.util';

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
                name: savedCourse.name
            }
        };
    }

    async findAll(paginationDto: PaginationDto): Promise<GetCoursesResponseDto> {
        const { page, limit } = paginationDto;
        const skip = PaginationUtil.getSkip(page, limit);

        const [courses, total] = await Promise.all([
            this.courseModel
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ _id: 1 })
                .exec(),

            this.courseModel
                .countDocuments()
                .exec()
        ])

        if (!courses || courses.length === 0) {
            return PaginationUtil.paginate(
                true, 
                "Courses fetched successfully",
                [],
                total,
                page,
                limit
            );
        }

        const data = courses.map((course: Course) => {
            return {
                _id: course._id.toString(),
                name: course.name,
                createdAt: course.createdAt.toDateString(),
                courseId: course.courseId
            }
        })

        return PaginationUtil.paginate(
             true, 
             "Courses fetched successfully",
             data,
             total,
             page,
             limit
         );
    }


    async search(searchDto: SearchCoursesDto): Promise<GetCoursesResponseDto> {
        const { 
            page, 
            limit, 
            searchTerm, 
            sortBy = CourseSortField.CREATED_AT,
            sortOrder = CourseSortOrder.DESC
        } = searchDto;
    
        const skip = PaginationUtil.getSkip(page, limit);
    
        // Build query filters
        let filters: any = {};

    
        // Text search across multiple fields
        if (searchTerm) {
            const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchValue = new RegExp(escaped, 'i');
            const orConditions : any = [
                { name: searchValue },
                { description: searchValue }
            ];

            const numValue = Number(searchTerm);
            if (!isNaN(numValue)) {
                orConditions.push({ courseId: numValue });
            }

            filters = { $or: orConditions };
        }
    
        // Build sort object
        const sortObject: any = {};
        sortObject[sortBy] = sortOrder === CourseSortOrder.ASC ? 1 : -1;
    
        try {
            const [courses, total] = await Promise.all([
                this.courseModel
                    .find(filters)
                    .skip(skip)
                    .limit(limit)
                    .sort(sortObject)
                    .exec(),
    
                this.courseModel
                    .countDocuments(filters)
                    .exec()
            ]);
    
            if (!courses || courses.length === 0) {
                return PaginationUtil.paginate(
                    true,
                    "Courses search completed successfully",
                    [],
                    total,
                    page,
                    limit
                );
            }
    
            // Transform courses data
            const data = courses.map((course: Course) => ({
                _id: course._id.toString(),
                courseId: course.courseId,
                name: course.name,
                description: course.description,
                createdAt: course.createdAt.toDateString()
            }));

            return PaginationUtil.paginate(
                true,
                "Courses search completed successfully",
                data,
                total,
                page,
                limit
            );
    
        } catch (error) {
            console.error('Error in course search:', error);
            throw new BadRequestException('Error occurred while searching courses');
        }
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
                createdAt: course.createdAt.toDateString(),
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
                name: updatedCourse.name
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
            message: 'Course deleted successfully.'
        };

    }
}