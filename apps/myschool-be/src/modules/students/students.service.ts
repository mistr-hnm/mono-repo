import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/lib/response-exceptions';

@Injectable()
export class StudentsService {

    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>
    ) { }

    create(student: Student): Promise<Student> {
        const newStudent = new this.studentModel(student);
        return newStudent.save();
    }

    async findAll(): Promise<any> {
        try {
            const students = await this.studentModel.find().populate('enrollmentCourse', ["_id", "name"]).exec();
            return { success: true, data: students };
        } catch (err) {
            throw new BadRequestException();
        }
    }

    findById(id: string): Promise<Student | null> {
        const course = this.studentModel.findById(id).populate('enrollmentCourse', ["_id", "name"]).exec();
        return course;
    }

    update(id: string, course: Partial<Student>): Promise<Student | null> {
        return this.studentModel.findByIdAndUpdate(id, course, { new: true }).exec();
    }

    delete(id: string): Promise<Student | null> {
        return this.studentModel.findByIdAndDelete(id).exec();
    }

}
