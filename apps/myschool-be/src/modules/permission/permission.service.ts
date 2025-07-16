import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from 'src/lib/response-exceptions';
import {
    CreatePermissionDto,
    CreatePermissionResponseDto,
    UpdatePermissionDto,
    UpdatePermissionResponseDto,
    GetPermissionResponseDto,
    GetPermissionsResponseDto,
    DeletePermissionResponseDto,
    GetAllPermissionsDto
} from './schemas/permission.dto';


@Injectable()
export class PermissionService {

    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<CreatePermissionResponseDto> {
        const alreadyExist = await this.permissionModel.findOne({ module: createPermissionDto.module }).select(["_id"]);
        if (alreadyExist) {
            throw new BadRequestException(`Permission set for module "${createPermissionDto.module}" already exists.`);
        }

        const newPermission = new this.permissionModel(createPermissionDto);
        const savedPermission = await newPermission.save();

        return {
            status: true,
            message: "Permission created successfully",
            data: {
                _id: savedPermission._id.toString(),
                module: savedPermission.module,
                permission: savedPermission.permission,
                description: savedPermission.description,
            }
        };
    }

    async findAll(getAllPermissionsDto?: GetAllPermissionsDto): Promise<GetPermissionsResponseDto> {
        const { limit, offset } = getAllPermissionsDto || {};

        const query = this.permissionModel.find();

        if (limit !== undefined && offset !== undefined) {
            query.limit(limit).skip(offset);
        }

        const permissions = await query.exec();

        if (!permissions || permissions.length === 0) {
            throw new NotFoundException("No permissions found.");
        }
        
        return {
            status: true,
            message: "Permissions fetched successfully",
            data: permissions.map(permission => ({
                _id: permission._id.toString(),
                module: permission.module,
                permission: permission.permission,
                description: permission.description,
            }))
        };

    }

    async findById(id: string): Promise<GetPermissionResponseDto> {
        const permission = await this.permissionModel.findById(id).exec();

        if (!permission) {
            throw new NotFoundException("No permissions found.");
        }

        return {
            status: true,
            message: "Permission fetched successfully",
            data: {
                _id: permission._id.toString(),
                module: permission.module,
                permission: permission.permission,
                description: permission.description
            }
        };

    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<UpdatePermissionResponseDto> {
        if (updatePermissionDto.module) {
            const existingPermissionWithModule = await this.permissionModel.findOne({
                module: updatePermissionDto.module,
                _id: { $ne: id }
            }).exec();

            if (existingPermissionWithModule) {
                throw new BadRequestException(`Permission for module "${updatePermissionDto.module}" already exists.`);
            }
        }

        const updatedPermission = await this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, { new: true }).exec();

        if (!updatedPermission) {
            throw new NotFoundException(`Permission with ID "${id}" not found for update.`);
        }

        return {
            status: true,
            message: "Permission updated successfully",
            data: {
                _id: updatedPermission._id.toString(),
                module: updatedPermission.module,
                permission: updatedPermission.permission,
                description: updatedPermission.description,
            }
        };

    }

    async delete(id: string): Promise<DeletePermissionResponseDto> {
        const deletedPermission = await this.permissionModel.findByIdAndDelete(id).exec();

        if (!deletedPermission) {
            throw new NotFoundException(`Permission with ID "${id}" not found for deletion.`);
        }

        return {
            status: true,
            message: `Permission with ID "${id}" deleted successfully.`
        };
    }
}