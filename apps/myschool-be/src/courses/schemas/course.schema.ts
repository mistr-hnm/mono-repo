
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps : true})
export class Course {

    @Prop({required : true})
    courseId: number;

    @Prop({required : true})
    name: string;

    @Prop()
    description: string;

    createdAt?: Date;

    updatedAt?: Date;

}

export const CourseSchema = SchemaFactory.createForClass(Course);



// Another manual way (with out schema option)
// export const CatSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     breed: String,
//   });
  