
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from 'src/core/meta/base.schema';

@Schema({ timestamps : true})
export class File extends BaseSchema {

    _id: Types.ObjectId;

    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    url: string;
    
}

export type FileDocument = HydratedDocument<File>;
export const FileSchema = SchemaFactory.createForClass(File);