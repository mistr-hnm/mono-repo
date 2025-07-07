
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/modules/courses/schemas/course.schema';


const StudentStatus    = { ACTIVE : "ACTIVE", SUSPENDED : "SUSPENDED" };
type StudentStatusType = keyof typeof StudentStatus;

@Schema({ timestamps : true})
export class Student {

    @Prop({required : true})
    enrollmentNumber: number;

    @Prop({required : true})
    fullname: string;

    @Prop({required : true})
    dateofbirth: Date;

    @Prop({type : mongoose.Schema.Types.ObjectId, ref: 'Course' })
    enrollmentCourse: Course;

    @Prop()
    description: string;

    @Prop()
    picture: string;

    @Prop({
        type: String,
        required: true,
        default : StudentStatus.ACTIVE,
        enum: Object.values(StudentStatus),
    })
    status: StudentStatusType;


    createdAt?: Date;

    updatedAt?: Date;

}


export type  StudentDocument = HydratedDocument<Student>;
export const StudentSchema   = SchemaFactory.createForClass(Student);


// Another manual way (with out schema option)
// export const CatSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     breed: String,
//   });
  