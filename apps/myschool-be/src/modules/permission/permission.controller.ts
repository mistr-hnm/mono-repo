import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger'; // Added specific ApiResponse decorators
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

@Controller()
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) {}

    @ApiOperation({ summary: "Create a new permission" })
    @ApiBody({
        description: "Permission data for creation.",
        type: CreatePermissionDto // Use the DTO type directly
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission created successfully", type: CreatePermissionResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @Post()
    async create(@Body() createPermissionDto: CreatePermissionDto) { // Use the DTO for the body
        return await this.permissionService.create(createPermissionDto);
    }

    @ApiOperation({ summary: "Get all permissions" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permissions fetched successfully", type: GetPermissionsResponseDto }) // Use type for DTOs
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    // @ApiQuery({ type: GetAllPermissionsDto, required: false }) // Uncomment if you add pagination/filters
    @Get()
    async findAll() { // If you plan to add pagination/filters later, consider adding @Query() params
        return await this.permissionService.findAll();
    }

    @ApiOperation({ summary: "Get permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to retrieve.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission fetched successfully", type: GetPermissionResponseDto }) // Use type for DTOs
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Permission not found." }) // Specific for not found
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.permissionService.findById(id);
    }

    @ApiOperation({ summary: "Update permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to update.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiBody({
        description: "Partial permission data for update.",
        type: UpdatePermissionDto // Use the DTO type directly
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission updated successfully", type: UpdatePermissionResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Permission not found." }) // Specific for not found
    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) { // Use the DTO for the body
        return await this.permissionService.update(id, updatePermissionDto);
    }

    @ApiOperation({ summary: "Delete permission by ID" })
    @ApiParam({ name: 'id', description: "ID of the permission to delete.", type: String, format: 'uuid' }) // Explicitly define type
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Permission deleted successfully", type: DeletePermissionResponseDto }) // Use type for DTOs
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Permission not found." }) // Specific for not found
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.permissionService.delete(id);
    }
}