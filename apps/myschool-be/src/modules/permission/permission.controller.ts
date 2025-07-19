import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger'; // Added specific ApiResponse decorators
import { PermissionService } from './permission.service';
import {
    CreatePermissionDto,
    CreatePermissionResponseDto,
    UpdatePermissionDto,
    UpdatePermissionResponseDto,
    GetPermissionResponseDto,
    GetPermissionsResponseDto,
    DeletePermissionResponseDto
} from './schemas/permission.dto';
import { signture } from 'src/core/meta/global.header';
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from 'src/lib/global.response';

@Controller()
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }

    @ApiOperation({ summary: "Create a new permission" })
    @ApiBody({
        description: "Permission data for creation.",
        type: CreatePermissionDto
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission created successfully", type: CreatePermissionResponseDto })
    @ApiBadRequestResponse({ description: "Bad request", type: BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unautherized", type: UnauthorizedResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    @Post()
    async create(@Body() createPermissionDto: CreatePermissionDto) {
        return await this.permissionService.create(createPermissionDto);
    }

    @ApiOperation({ summary: "Get all permissions" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permissions fetched successfully", type: GetPermissionsResponseDto })
    @ApiUnauthorizedResponse({ description: "Unautherized", type: UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Permission not found", type: NotFoundResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    // @ApiQuery({ type: GetAllPermissionsDto, required: false }) // @todo: for pagination
    @Get()
    async findAll() { // @Query() params for pagination
        return await this.permissionService.findAll();
    }

    @ApiOperation({ summary: "Get permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to retrieve.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission fetched successfully", type: GetPermissionResponseDto })
    @ApiBadRequestResponse({ description: "Bad request", type: BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unautherized", type: UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Permission not found", type: NotFoundResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.permissionService.findById(id);
    }

    @ApiOperation({ summary: "Update permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to update.", type: String, format: 'uuid' })
    @ApiBody({
        description: "Partial permission data for update.",
        type: UpdatePermissionDto
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission updated successfully", type: UpdatePermissionResponseDto })
    @ApiBadRequestResponse({ description: "Bad request", type: BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unautherized", type: UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Permission not found", type: NotFoundResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return await this.permissionService.update(id, updatePermissionDto);
    }

    @ApiOperation({ summary: "Delete permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to delete.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission deleted successfully", type: DeletePermissionResponseDto })
    @ApiBadRequestResponse({ description: "Bad request", type: BadRequestResponseDto })
    @ApiUnauthorizedResponse({ description: "Unautherized", type: UnauthorizedResponseDto })
    @ApiNotFoundResponse({ description: "Permission not found", type: NotFoundResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.permissionService.delete(id);
    }
}