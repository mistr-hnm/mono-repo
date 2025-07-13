
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/core/meta/base.schema';
@Schema()
export class Course extends BaseSchema {

    @Prop({ required: true })
    courseId: number;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

}

export type CourseDocument = HydratedDocument<Course>;
export const CourseSchema = SchemaFactory.createForClass(Course);