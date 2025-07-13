import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { LoginUserBody } from "@myschool/schema/src/api";
import { User } from './schemas/user.schema';
import { ApiBody, ApiHeaders, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { signture } from 'src/core/meta/global.header';
import { createUserValidator, loginValidator, updateUserValidator } from './schemas/user.validator';
import { createUserResponseSchema, deleteUserResponseSchema, getAllUsersResponseSchema, getUserResponseSchema, loginResponseSchema, updateUserResponseSchema } from './schemas/user.response';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiOperation({ summary: "User login" })
    @ApiBody({
        description: "User credentials for login. Provide a valid email and password.",
        schema: loginValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(loginResponseSchema[200])
    @ApiResponse(loginResponseSchema[401])
    @HttpCode(200)
    @Post("/login")
    async login(@Body() user: LoginUserBody) {
        return await this.userService.login(user);  // @todo : move this to auth service
    }

    @ApiOperation({ summary: "Create a new user" })
    @ApiBody({
        description: "User data for creation.",
        schema:  createUserValidator  
    })
    @ApiHeaders([signture, ])
    @ApiResponse(createUserResponseSchema[200])
    @ApiResponse(createUserResponseSchema[401])
    @Post("signup")
    async create(@Body() user: User) {
        return await this.userService.create(user);
    }

    @ApiOperation({ summary: "Get all users" })
    @ApiHeaders([signture, ])
    @ApiResponse(getAllUsersResponseSchema[200])
    @ApiResponse(getAllUsersResponseSchema[401])
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: "Get user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to retrieve.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(getUserResponseSchema[200])
    @ApiResponse(getUserResponseSchema[401])
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @ApiOperation({ summary: "Update user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to update.", required: true })
    @ApiBody({
        description: "Partial user data for update.",
        schema: updateUserValidator
    })
    @ApiHeaders([signture])
    @ApiResponse(updateUserResponseSchema[200])
    @ApiResponse(updateUserResponseSchema[401])
    @ApiResponse({ status: 404, description: "User not found." })
    @Put(':id')
    update(@Param('id') id: string, @Body() course: Partial<User>) {
        return this.userService.update(id, course);
    }

    @ApiOperation({ summary: "Delete user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to delete.", required: true })
    @ApiHeaders([signture])
    @ApiResponse(deleteUserResponseSchema[200])
    @ApiResponse(deleteUserResponseSchema[401])
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
