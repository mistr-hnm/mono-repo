import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/lib/response-exceptions';

@Injectable()
export class PermissionService {

    constructor(
        @InjectModel(Permission.name) private permssionModel: Model<PermissionDocument>
    ) { }

    create(course: Permission): Promise<Permission> {
        const newPermission = new this.permssionModel(course);
        return newPermission.save();
    }

   async findAll(): Promise<any> {
        try {
            const courses = await this.permssionModel.find().exec();
            return { success: true, data: courses };
        } catch (err) {
            throw new BadRequestException();
        }
    }

    findById(id: string): Promise<Permission | null> {
        const course = this.permssionModel.findById(id).exec();
        return course;
    }

    update(id: string, course: Partial<Permission>): Promise<Permission | null> {
        return this.permssionModel.findByIdAndUpdate(id, course, { new: true }).exec();
    }

    delete(id: string): Promise<Permission | null> {
        return this.permssionModel.findByIdAndDelete(id).exec();
    }
}
