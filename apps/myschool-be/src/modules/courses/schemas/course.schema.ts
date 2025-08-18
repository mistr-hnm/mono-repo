
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '../../../core/meta/base.schema';
@Schema({ timestamps : true})
export class Course extends BaseSchema {

    
    _id: Types.ObjectId;

    @Prop({ required: true })
    courseId: number;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

}

export type CourseDocument = HydratedDocument<Course>;
export const CourseSchema = SchemaFactory.createForClass(Course);