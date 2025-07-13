import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { Permission } from './schemas/permission.schema';
import { signture } from 'src/core/meta/global.header';
import { createPermissionValidator, updatePermissionValidator } from './schemas/permission.validator';
import { createPermissionResponseSchema, getAllPermissionsResponseSchema, getPermissionResponseSchema, updatePermissionResponseSchema } from './schemas/permission.response';

@Controller()
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) {}

    @ApiOperation({ summary: "Create a new permission" })
    @ApiBody({
        description: "Permission data for creation.",
        schema: createPermissionValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(createPermissionResponseSchema[200])
    @ApiResponse(createPermissionResponseSchema[401])
    @Post()
    create(@Body() permission: Permission) {
        return this.permissionService.create(permission);
    }

    @ApiOperation({ summary: "Get all permissions" })
    @ApiHeaders([signture])
    @ApiResponse(getAllPermissionsResponseSchema[200])
    @ApiResponse(getAllPermissionsResponseSchema[401])
    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @ApiOperation({ summary: "Get permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to retrieve.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(getPermissionResponseSchema[200])
    @ApiResponse(getPermissionResponseSchema[401])
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.permissionService.findById(id);
    }

    @ApiOperation({ summary: "Update permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to update.", required: true })
    @ApiBody({
        description: "Partial permission data for update.",
        schema: updatePermissionValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(updatePermissionResponseSchema[200])
    @ApiResponse(updatePermissionResponseSchema[401])
    @ApiResponse({ status: 404, description: "Permission not found." })
    @Put(':id')
    update(@Param('id') id: string, @Body() permission: Partial<Permission>) {
        return this.permissionService.update(id, permission);
    }

    @ApiOperation({ summary: "Delete permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to delete.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(updatePermissionResponseSchema[200])
    @ApiResponse(updatePermissionResponseSchema[401])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}