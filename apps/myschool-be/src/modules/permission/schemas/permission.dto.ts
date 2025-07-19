import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayUnique, IsMongoId, IsNumber, Min } from 'class-validator';
 
export class CreatePermissionDto {
    @ApiProperty({ example: "users", description: "The module to which this permission applies (e.g., 'users', 'products', 'settings')" })
    @IsString()
    @IsNotEmpty()
    readonly module: string;

    @ApiProperty({ example: ["r", "w", "d"], description: "An array of permission actions within the module (e.g., 'read', 'write', 'update', 'delete')", isArray: true, type: String })
    @IsArray()
    @IsString({ each: true }) 
    @IsNotEmpty({ each: true })
    @ArrayUnique() 
    readonly permission: string[];

    @ApiProperty({ example: "Allows managing user accounts.", description: "A brief description of this permission set" , required : false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}
 

export class PermissionDto {

    @ApiProperty({ example: "sdsr343redf3434rgfd454", description: "The unique identifier of permission" })
    @IsString()
    @IsNotEmpty()
    readonly _id: string;


    @ApiProperty({ example: "users", description: "The module to which this permission applies (e.g., 'users', 'products', 'settings')" })
    @IsString()
    @IsNotEmpty()
    readonly module: string;

    @ApiProperty({ example: ["r", "w", "d"], description: "An array of permission actions within the module (e.g., 'read', 'write', 'update', 'delete')", isArray: true, type: String })
    @IsArray()
    @IsString({ each: true }) 
    @IsNotEmpty({ each: true })
    @ArrayUnique() 
    readonly permission: string[];

    @ApiProperty({ example: "Allows managing user accounts.", description: "A brief description of this permission set" , required : false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

export class CreatePermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the permission creation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Permission created', description: 'A message detailing the outcome (optional, present if success is false)'  })
    message: string;

    @ApiProperty({
        type : [PermissionDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'users',
            permission: ['r', 'w', 'd'],
            description: 'Allows managing user accounts.', 
        },
        description: 'The created permission data object',
    })
    data: {
        _id: string;
        module: string;
        permission: string[];
        description?: string; 
    };
    
}
 
export class UpdatePermissionDto {
    

    @ApiProperty({ example: "products", description: "The updated module name" })
    @IsString()
    @IsOptional()
    readonly module?: string;

    @ApiProperty({ example: ["r", "w"], description: "The updated array of permission actions", isArray: true, type: String })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @ArrayUnique()
    @IsOptional()
    readonly permission?: string[];

    @ApiProperty({ example: "Allows viewing and editing product details.", description: "The updated description of this permission set" , required : false })
    @IsString()
    @IsOptional()
    readonly description?: string;
} 

export class UpdatePermissionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the permission update was successful' })
    status: boolean;

    @ApiProperty({ example: 'Permission not found', description: 'A message detailing the outcome (optional, present if success is false)'  })
    message: string;

    @ApiProperty({
        type : [PermissionDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'products',
            permission: ['r', 'w'],
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
    status: boolean;

    @ApiProperty({ example: 'Permission not found', description: 'A message detailing the outcome (optional, present if success is false)'  })
    message: string;

    @ApiProperty({
        type : [PermissionDto],
        example: {
            _id: '60c72b2f9b1e8b0015b0e4d7',
            module: 'users',
            permission: ['r', 'w', 'd'],
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

}
 
export class GetAllPermissionsDto {
    @ApiProperty({ example: 10, description: "The number of permission sets to retrieve per page" })
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination" })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly offset?: number;
}
 
export class GetPermissionsResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'No permissions found', description: 'A message detailing the outcome (optional, present if success is false)'  })
    message: string;

    @ApiProperty({
        type : [PermissionDto],
        example: [
            {
                _id: '60c72b2f9b1e8b0015b0e4d7',
                module: 'courses',
                permission: ['r', 'w', 'd'],
                description: 'Allows managing user accounts.', 
            },
            {
                _id: '60c72b2f9b1e8b0015b0e4d8',
                module: 'students',
                permission: ['r', 'd'],
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
    status: boolean;

    @ApiProperty({ example: 'Permission deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}