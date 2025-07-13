import { Prop, Schema } from "@nestjs/mongoose";

export enum Status {
    ACTIVE = "active",
    DELETED = "deleted",
}


@Schema({ timestamps : true})
export class BaseSchema {

    @Prop({type : String, enum : Status, default : Status.ACTIVE })
    status: Status;

}