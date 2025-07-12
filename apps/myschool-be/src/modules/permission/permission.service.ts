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

    create(permission: Permission): Promise<Permission> {
        const newPermission = new this.permssionModel(permission);
        return newPermission.save();
    }

   async findAll(): Promise<any> {
        try {
            const permissions = await this.permssionModel.find().exec();
            return { success: true, data: permissions };
        } catch (err) {
            throw new BadRequestException();
        }
    }

    findById(id: string): Promise<Permission | null> {
        const permission = this.permssionModel.findById(id).exec();
        return permission;
    }

    update(id: string, permission: Partial<Permission>): Promise<Permission | null> {
        return this.permssionModel.findByIdAndUpdate(id, permission, { new: true }).exec();
    }

    delete(id: string): Promise<Permission | null> {
        return this.permssionModel.findByIdAndDelete(id).exec();
    }
}
