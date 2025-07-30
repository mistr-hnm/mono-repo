import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Model } from 'mongoose'; 
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
import { FileService } from '../file/file.service';

@Injectable()
export class StudentsService {

    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,

        private fileService : FileService
    ) { }

    async create(createStudentDto: CreateStudentDto): Promise<CreateStudentResponseDto> {

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
            status: true,
            message: "Student created successfully",
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
                picture: populatedStudent.picture 
            }
        };

    }

    async findAll(getAllStudentsDto?: GetAllStudentsDto): Promise<GetStudentsResponseDto> {
        const { limit, offset } = getAllStudentsDto || {} //@todo

        const query = this.studentModel.find()
            .populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description'])
            .populate('picture',['_id','key'])

        if (limit !== undefined && offset !== undefined) {
            query.limit(limit).skip(offset);
        }

        const students = await query.exec()

        if (!students || students.length === 0) {
            throw new NotFoundException("Student not found.")
        }
        const includeBuffers = true
        const processStudent = async (student) => {
            let picture = student.picture;
            
            if (includeBuffers && student.picture) {
                try {
                    const buffer = await this.fileService.getObjectBuffer(student.picture.key);
                    picture = {
                        buffer: `data:image/jpeg;base64,${buffer.toString('base64')}`,
                        size: buffer.length,
                        _id: student.picture._id,
                        key: student.picture.key
                    };
                } catch (error) {
                    console.error(`Error loading buffer for ${student.picture._id}:`, error);
                }
            }
    
            return {
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
                picture,
                createdAt: student.createdAt.toDateString()
            };
        };
        const processedStudents = await Promise.all(students.map(processStudent));
        
        return {
            status: true,
            message: "Student fetched successfully",
            data: processedStudents
        }
    }

    async findById(id: string): Promise<GetStudentResponseDto> {

        const student = await this.studentModel.findById(id)
            .populate('enrollmentCourse', ['_id', 'courseId', 'name', 'description'])
            .exec()

        if (!student) {
            throw new NotFoundException("Student not found.");
        }


        return {
            status: true,
            message: "Student fetched successfully",
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
                createdAt: student.createdAt.toDateString()
            }
        };

    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<UpdateStudentResponseDto> {

        if (updateStudentDto.enrollmentNumber) {
            const existingStudentWithEnrollment = await this.studentModel.findOne({
                enrollmentNumber: updateStudentDto.enrollmentNumber,
                _id: { $ne: id }
            }).exec();
            if (existingStudentWithEnrollment) {
                throw new BadRequestException("Another student with this enrollment number already exists.");
            }
        }
 
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
            throw new BadRequestException(`Student not found for update.`);
        }

        return {
            status: true,
            message: "Student updated successfully",
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
        }
    }

    async delete(id: string): Promise<DeleteStudentResponseDto> {
        const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

        if (!deletedStudent) {
            throw new NotFoundException(`Student not found.`);
        }
        return {
            status: true,
            message: `Student deleted successfully.`
        };
    }
}