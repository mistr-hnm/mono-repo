import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { FileService } from '../file/file.service';
import { FileModule } from '../file/file.module';

@Module({
    imports : [
        MongooseModule.forFeature([
            { name: Student.name, schema: StudentSchema },
            { name: Course.name, schema: CourseSchema },
        ]),
        FileModule
    ],
    controllers: [StudentsController],
    providers: [
        StudentsService
    ]
})
export class StudentsModule {}
