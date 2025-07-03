import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {

    constructor(
        @InjectModel(Course.name) private courseModel : Model<CourseDocument> 
    ) { }

    create(course : Course) : Promise<Course>{
        const newCourse = new this.courseModel(course);
        return newCourse.save();
    }

    findAll() : Promise<Course[]>{
        return this.courseModel.find().exec();
    }

    findById(id: string): Promise<Course | null> {
        const course =  this.courseModel.findById(id).exec();
        return course;
    }

    update(id: string, course: Partial<Course>): Promise<Course | null> {
        return this.courseModel.findByIdAndUpdate(id, course, { new: true }).exec();
    }

    delete(id: string): Promise<Course | null> {
        return this.courseModel.findByIdAndDelete(id).exec();
    }
}
