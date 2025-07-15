import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/lib/response-exceptions';
import {
    CreateStudentDto,
    CreateStudentResponseDto,
    UpdateStudentDto,
    UpdateStudentResponseDto,
    GetStudentResponseDto,
    GetStudentsResponseDto,
    DeleteStudentResponseDto,
    GetAllStudentsDto
} from './schemas/student.dto';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class StudentsService {

    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>
    ) { }

    async create(createStudentDto: CreateStudentDto): Promise<CreateStudentResponseDto> {
        try {
            const alreadyExist = await this.studentModel.findOne({ enrollmentNumber: createStudentDto.enrollmentNumber }).select(["_id"]);
            if (alreadyExist) {
                throw new BadRequestException("Student with this enrollment number already exists.");
            }

            const course = await this.courseModel.findById(createStudentDto.enrollmentCourse).exec();
            if (!course) {
                throw new BadRequestException("Enrollment course not found.");
            }

            const newStudent = new this.studentModel(createStudentDto);
            const savedStudent = await newStudent.save();

            const populatedStudent = await savedStudent.populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description']);

            return {
                success: true,
                data: {
                    _id: populatedStudent._id.toString(),
                    enrollmentNumber: populatedStudent.enrollmentNumber,
                    fullname: populatedStudent.fullname,
                    dateofbirth: populatedStudent.dateofbirth.toISOString(), // Convert Date to ISO string
                    enrollmentCourse: {
                        _id: (populatedStudent.enrollmentCourse as Course)._id.toString(),
                        courseId: (populatedStudent.enrollmentCourse as Course).courseId,
                        name: (populatedStudent.enrollmentCourse as Course).name,
                        description: (populatedStudent.enrollmentCourse as Course).description
                    },
                    description: populatedStudent.description,
                    picture: populatedStudent.picture,
                }
            };
        } catch (e) {
            if (e instanceof BadRequestException) {
                throw e;
            }
            throw new BadRequestException("Student creation failed.");
        }
    }

    async findAll(getAllStudentsDto?: GetAllStudentsDto): Promise<GetStudentsResponseDto> {
        try {
            const { limit, offset } = getAllStudentsDto || {}; //@todo

            const query = this.studentModel.find()
                .populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description']);

            if (limit !== undefined && offset !== undefined) {
                query.limit(limit).skip(offset);
            }

            const students = await query.exec();

            if (!students || students.length === 0) {
                return {
                    success: false,
                    message: "No students found."
                };
            }

            return {
                success: true,
                data: students.map(student => ({
                    _id: student._id.toString(),
                    enrollmentNumber: student.enrollmentNumber,
                    fullname: student.fullname,
                    dateofbirth: student.dateofbirth.toISOString(),
                    enrollmentCourse: {
                        _id: (student.enrollmentCourse as Course)._id.toString(),
                        courseId: (student.enrollmentCourse as Course).courseId,
                        name: (student.enrollmentCourse as Course).name,
                        description: (student.enrollmentCourse as Course).description
                    },
                    description: student.description,
                    picture: student.picture,
                }))
            };
        } catch (err) {
            throw new BadRequestException("Failed to retrieve students.");
        }
    }

    async findById(id: string): Promise<GetStudentResponseDto> {
        try {
            const student = await this.studentModel.findById(id)
                .populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description'])
                .exec();

            if (!student) {
                return {
                    success: false,
                    message: `Student with ID "${id}" not found.`
                };
            }


            return {
                success: true,
                data: {
                    _id: student._id.toString(),
                    enrollmentNumber: student.enrollmentNumber,
                    fullname: student.fullname,
                    dateofbirth: student.dateofbirth.toISOString(),
                    enrollmentCourse: {
                        _id: (student.enrollmentCourse as Course)._id.toString(),
                        courseId: (student.enrollmentCourse as Course).courseId,
                        name: (student.enrollmentCourse as Course).name,
                        description: (student.enrollmentCourse as Course).description
                    },
                    description: student.description,
                    picture: student.picture,
                }
            };
        } catch (e) {
            throw new BadRequestException(`Failed to find student with ID "${id}".`);
        }
    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<UpdateStudentResponseDto> {
        try {
            if (updateStudentDto.enrollmentNumber) {
                const existingStudentWithEnrollment = await this.studentModel.findOne({
                    enrollmentNumber: updateStudentDto.enrollmentNumber,
                    _id: { $ne: id }
                }).exec();
                if (existingStudentWithEnrollment) {
                    throw new BadRequestException("Another student with this enrollment number already exists.");
                }
            }

            // Verify if the enrollmentCourse exists if it's being updated
            if (updateStudentDto.enrollmentCourse) {
                const course = await this.courseModel.findById(updateStudentDto.enrollmentCourse).exec();
                if (!course) {
                    throw new BadRequestException("Enrollment course not found.");
                }
            }

            const updatedStudent = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true })
                .populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description'])
                .exec();

            if (!updatedStudent) {
                return {
                    success: false,
                    message: `Student with ID "${id}" not found for update.`
                };
            }

            return {
                success: true,
                data: {
                    _id: updatedStudent._id.toString(),
                    enrollmentNumber: updatedStudent.enrollmentNumber,
                    fullname: updatedStudent.fullname,
                    dateofbirth: updatedStudent.dateofbirth.toISOString(),
                    enrollmentCourse: {
                        _id: (updatedStudent.enrollmentCourse as Course)._id.toString(),
                        courseId: (updatedStudent.enrollmentCourse as Course).courseId,
                        name: (updatedStudent.enrollmentCourse as Course).name,
                        description: (updatedStudent.enrollmentCourse as Course).description
                    },
                    description: updatedStudent.description,
                    picture: updatedStudent.picture,
                }
            };
        } catch (e) {
            if (e instanceof BadRequestException) {
                throw e;
            }
            throw new BadRequestException(`Failed to update student with ID "${id}".`);
        }
    }

    async delete(id: string): Promise<DeleteStudentResponseDto> {
        try {
            const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

            if (!deletedStudent) {
                return {
                    success: false,
                    message: `Student with ID "${id}" not found for deletion.`
                };
            }

            return {
                success: true,
                message: `Student with ID "${id}" deleted successfully.`
            };
        } catch (e) {
            throw new BadRequestException(`Failed to delete student with ID "${id}".`);
        }
    }
}