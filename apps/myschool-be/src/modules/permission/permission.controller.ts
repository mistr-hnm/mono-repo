import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './schemas/permission.schema';

@Controller()
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }


    @Post()
    create(@Body() permission: Permission) {
        return this.permissionService.create(permission);
    }

    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.permissionService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() permission: Partial<Permission>) {
        return this.permissionService.update(id, permission);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }


}
