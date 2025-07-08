import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/core/meta/base.schema';


@Schema()
export class User extends BaseSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    description: string;

}

export type UserDocument = HydratedDocument<User>;
export const UserSchema  = SchemaFactory.createForClass(User);