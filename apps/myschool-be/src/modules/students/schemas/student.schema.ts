
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/core/meta/base.schema';
import { Course } from 'src/modules/courses/schemas/course.schema';


@Schema({ timestamps : true })
export class Student extends BaseSchema {

    @Prop({required : true})
    enrollmentNumber: number;

    @Prop({required : true})
    fullname: string;

    @Prop({required : true})
    dateofbirth: Date;

    @Prop({type : mongoose.Schema.Types.ObjectId, ref: 'Course' })
    enrollmentCourse: Course;
    
    @Prop({type : mongoose.Schema.Types.ObjectId, ref: 'File' })
    picture: string;
 
    @Prop()
    description: string;
}


export type  StudentDocument = HydratedDocument<Student>;
export const StudentSchema   = SchemaFactory.createForClass(Student);
