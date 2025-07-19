import { ApiProperty } from "@nestjs/swagger";

 
export class BadRequestResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({
        example: {
            message: 'Details of operation.',
            error: "Bad Request",
            statusCode: 400, 
        },
        description: 'The data object'
    })
    message: {
        message: string;
        error: string;
        statusCode: number;
    };

    @ApiProperty({ example: new Date().toUTCString(), description: 'A timestamp of operation' })
    timestamp: Date;

    @ApiProperty({ example: "/api/v1/endpoint", description: 'A end point of api' })
    path: string;

}



export class UnauthorizedResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({
        example: {
            message: 'Details of operation.',
            error: "Unauthorized",
            statusCode: 401, 
        },
        description: 'The data object'
    })
    message: {
        message: string;
        error: string;
        statusCode: number;
    };

    @ApiProperty({ example: new Date().toUTCString(), description: 'A timestamp of operation' })
    timestamp: Date;

    @ApiProperty({ example: "/api/v1/endpoint", description: 'A end point of api' })
    path: string;

}



export class NotFoundResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({
        example: {
            message: 'Details of operation.',
            error: "Resouce not found",
            statusCode: 404, 
        },
        description: 'The data object'
    })
    message: {
        message: string;
        error: string;
        statusCode: number;
    };

    @ApiProperty({ example: new Date().toUTCString(), description: 'A timestamp of operation' })
    timestamp: Date;

    @ApiProperty({ example: "/api/v1/endpoint", description: 'A end point of api' })
    path: string;

}


export class InternalServerErrorResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({
        example: {
            message: 'Details of operation.',
            error: "Internal server error",
            statusCode: 500, 
        },
        description: 'The data object'
    })
    message: {
        message: string;
        error: string;
        statusCode: number;
    };

    @ApiProperty({ example: new Date().toUTCString(), description: 'A timestamp of operation' })
    timestamp: Date;

    @ApiProperty({ example: "/api/v1/endpoint", description: 'A end point of api' })
    path: string;

}