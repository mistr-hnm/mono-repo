import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/lib/response-exceptions';

@Injectable()
export class CoursesService {

    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>
    ) { }

    create(course: Course): Promise<Course> {
        const newCourse = new this.courseModel(course);
        return newCourse.save();
    }

   async findAll(): Promise<any> {
        try {
            const courses = await this.courseModel.find().exec();
            return { success: true, data: courses };
        } catch (err) {
            throw new BadRequestException();
        }
    }

    findById(id: string): Promise<Course | null> {
        const course = this.courseModel.findById(id).exec();
        return course;
    }

    update(id: string, course: Partial<Course>): Promise<Course | null> {
        return this.courseModel.findByIdAndUpdate(id, course, { new: true }).exec();
    }

    delete(id: string): Promise<Course | null> {
        return this.courseModel.findByIdAndDelete(id).exec();
    }
}
