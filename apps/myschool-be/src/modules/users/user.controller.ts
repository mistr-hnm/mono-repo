import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiOkResponse } from '@nestjs/swagger';
import { signture } from 'src/core/meta/global.header';
import { CreateUserDto, CreateUserResponseDto, DeleteUserResponseDto, GetUserByIdDto, GetUsersResponseDto, LoginUserDto, LoginUserResponseDto, UpdateUserDto, UpdateUserResponseDto } from './schemas/user.dto';


@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiOperation({ summary: "User login" })
    @ApiHeaders([signture])
    @ApiBody({
        description: "User credentials for login. Provide a valid email and password.",
        type: LoginUserDto
    })
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "Logged in successfully", type: LoginUserResponseDto })
    @HttpCode(200)
    @Post("/login")
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.userService.login(loginUserDto);  // @todo : move this to auth service
    }

    @ApiOperation({ summary: "Create a new user" })
    @ApiBody({
        description: "User data for creation.",
        type: CreateUserDto
    })
    @ApiHeaders([signture])
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "User created successfully", type: CreateUserResponseDto })
    @Post("signup")
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: "Get all users" })
    @ApiHeaders([signture])
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "User fetched successfully", type: GetUsersResponseDto })
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: "Get user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to retrieve.", required: true })
    @ApiHeaders([signture])
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "User fetched successfully", type: GetUserByIdDto })
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @ApiOperation({ summary: "Update user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to update.", required: true })
    @ApiBody({
        description: "Partial user data for update.",
        type: UpdateUserDto
    })
    @ApiHeaders([signture])
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "User updated successfully", type: UpdateUserResponseDto })
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: "Delete user by ID" })
    @ApiParam({ name: 'id', description: "ID of the user to delete.", required: true })
    @ApiHeaders([signture])
    @ApiBadRequestResponse({ description: "Invalid input" })
    @ApiUnauthorizedResponse({ description: "Unautherized" })
    @ApiOkResponse({ description: "User deleted successfully", type: DeleteUserResponseDto })
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}

