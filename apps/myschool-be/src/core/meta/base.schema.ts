import { Prop, Schema } from "@nestjs/mongoose";

export enum Status {
    ACTIVE = "active",
    DELETED = "deleted",
}


@Schema()
export class BaseSchema {

    @Prop({type : String, enum : Status, default : Status.ACTIVE })
    status: Status;

    @Prop()
    createdAt : Date;
    
    @Prop()
    updatedAt : Date;

}