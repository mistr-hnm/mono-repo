import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './schemas/permission.schema';

@Controller()
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }


    @Post()
    create(@Body() course: Permission) {
        return this.permissionService.create(course);
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
    update(@Param('id') id: string, @Body() course: Partial<Permission>) {
        return this.permissionService.update(id, course);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }


}
