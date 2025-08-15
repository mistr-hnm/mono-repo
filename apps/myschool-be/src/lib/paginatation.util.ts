import { IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    page: number = 1;

    @ApiProperty({ example: 10 })
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number = 10;

}

export class GetPaginationDto {
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    page: number = 1;

    @ApiProperty({ example: 10 })
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiProperty({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive() 
    total?: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive() 
    totalPages?: number;

    @ApiProperty({ example: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsPositive() 
    hasNext?: boolean;

    @ApiProperty({ example: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsPositive() 
    hasPrev?: boolean;
}

export interface PaginationResult<T> {
    data: T[],
    status : boolean,
    message : string,
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        hasPrev: boolean,
    }
}

export class PaginationUtil {
    static paginate<T>(
        status : boolean,
        message: string,
        data: T[],
        total: number,
        page: number,
        limit: number,
    ): PaginationResult<T> {
        
        const totalPages = Math.ceil(total / limit)
        const hasNext    = page < totalPages;
        const hasPrev    = page > 1;

        return {
            status,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        }
    }

    static getSkip(page: number, limit: number) {
        return (page - 1) * limit;
    }
}