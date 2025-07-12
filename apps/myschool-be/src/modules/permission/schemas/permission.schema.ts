
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/core/meta/base.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
export class Permission extends BaseSchema {

    @Prop({required : true})
    module: string;

    @Prop({required : true})
    permission: Array<string>;

    @Prop()
    description: string; 

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
  