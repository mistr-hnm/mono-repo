import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayUnique, IsMongoId, IsNumber, Min } from 'class-validator';
 
export class CreatePermissionDto {
    @ApiProperty({ example: "users", description: "The module to which this permission applies (e.g., 'users', 'products', 'settings')" })
    @IsString()
    @IsNotEmpty()
    readonly module: string;

    @ApiProperty({ example: ["read", "write", "delete"], description: "An array of permission actions within the module (e.g., 'read', 'write', 'update', 'delete')", isArray: true, type: String })
    @IsArray()
    @IsString({ each: true }) // Each item in the array must be a string
    @IsNotEmpty({ each: true }) // Each item in the array must not be empty
    @ArrayUnique() // Ensures all elements in the array are unique
    readonly permission: string[];

    @ApiProperty({ example: "Allows managing user accounts.", description: "A brief description of this permission set", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}
 
export class CreatePermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the permission creation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'users',
            permission: ['read', 'write', 'delete'],
            description: 'Allows managing user accounts.', 
        },
        description: 'The created permission data object',
    })
    data: {
        _id: string; // Assuming BaseSchema adds _id
        module: string;
        permission: string[];
        description?: string; 
    };
}
 
export class UpdatePermissionDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the permission set to update" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId() // Assuming 'id' is the MongoDB ObjectId string
    readonly id: string;

    @ApiProperty({ example: "products", description: "The updated module name", required: false })
    @IsString()
    @IsOptional()
    readonly module?: string;

    @ApiProperty({ example: ["view", "edit"], description: "The updated array of permission actions", required: false, isArray: true, type: String })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ArrayUnique()
    @IsOptional()
    readonly permission?: string[];

    @ApiProperty({ example: "Allows viewing and editing product details.", description: "The updated description of this permission set", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;
} 

export class UpdatePermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the permission update was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'products',
            permission: ['view', 'edit'],
            description: 'Allows viewing and editing product details.', 
        },
        description: 'The updated permission data object',
    })
    data?: {
        _id: string;
        module: string;
        permission: string[];
        description?: string; 
    };

    @ApiProperty({ example: 'Permission not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}
 
export class GetPermissionByIdDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the permission set" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;
}
 
export class GetPermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'users',
            permission: ['read', 'write', 'delete'],
            description: 'Allows managing user accounts.', 
        },
        description: 'The permission data object (optional, present if success is true)',
        required: false,
    })
    data?: {
        _id: string;
        module: string;
        permission: string[];
        description?: string; 
    };

    @ApiProperty({ example: 'Permission not found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}
 
export class GetAllPermissionsDto {
    @ApiProperty({ example: 10, description: "The number of permission sets to retrieve per page", required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination", required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly offset?: number;
}
 
export class GetPermissionsResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({
        type: [GetPermissionResponseDto], // Array of single permission response DTOs
        example: [
            {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                module: 'users',
                permission: ['read', 'write', 'delete'],
                description: 'Allows managing user accounts.', 
            },
            {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                module: 'products',
                permission: ['view', 'edit'],
                description: 'Allows viewing and editing product details.', 
            },
        ],
        description: 'An array of permission data objects',
    })
    data?: {
        _id: string;
        module: string;
        permission: string[];
        description?: string; 
    }[];

    @ApiProperty({ example: 'No permissions found', description: 'A message detailing the outcome (optional, present if success is false)', required: false })
    message?: string;
}
 
export class DeletePermissionDto {
    @ApiProperty({ example: "60c72b2f9b1e8b0015b0e4d7", description: "The unique identifier of the permission set to delete" })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;
} 


export class DeletePermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({ example: 'Permission deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}