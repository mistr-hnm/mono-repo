import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PermissionService } from '../permission/permission.service';
import { CacheService } from '../../shared/cache/cache.service';
import { CreateUserDto, CreateUserResponseDto, DeleteUserResponseDto, GetUserResponseDto, GetUsersResponseDto, LoginUserDto, LoginUserResponseDto, UpdateUserDto, UpdateUserResponseDto } from './schemas/user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,

        private permissionService: PermissionService,
        private cacheService: CacheService,
        private jwtService: JwtService,
    ) { }

    async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto | null> {
        const userData = await this.userModel.findOne({ email: loginUserDto.email }).select(["_id", "password"]);
        if (!userData) {
            throw new NotFoundException("User not found. Please register first.")
        }

        const isMatch = await bcrypt.compare(loginUserDto.password, userData.password);
        if (!isMatch) {
            throw new BadRequestException("Password incorrect.")
        };

        const payload = { sub: userData._id, email: loginUserDto.email }
        const token = await this.jwtService.signAsync(payload)

        const permission = await this.permissionService.findAll()
        
        await this.cacheService.addToCache('permission', JSON.stringify(permission.data));
        
        return {
            status: true,
            message: "User logged in successfully.",
            data: { user: userData._id.toString(), email: loginUserDto.email, token: token, permission: permission.data }
        };
    }

    async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {

        const alreadyExist = await this.userModel.findOne({ email: createUserDto.email }).select(["_id"]);
        if (alreadyExist) {
            throw new ConflictException("email already exist.");
        }

        const hash = await bcrypt.hash(createUserDto.password, 10);
        const payLoad = { ...createUserDto, password: hash };

        const newUser = new this.userModel(payLoad);
        await newUser.save();

        return {
            status: true,
            message: "User created successfully.",
            data: {
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                description: newUser.description,
            }
        };
    }

    async findAll(): Promise<GetUsersResponseDto> {
        const user = await this.userModel.find();
        if (!user) {
            throw new NotFoundException("User not found.")
        }
        return {
            status: true,
            message: "User fetched successfully.",
            data: user.map((user) => {
                return {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    description: user.description,
                }
            })
        };
    }

    async findById(id: string): Promise<GetUserResponseDto> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found.`)
        }
        return {
            status: true,
            message: "User fetched successfully.",
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                description: user.description,
            }
        };
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResponseDto> {

        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID "${id}" not found.`)
        }

        return {
            status: true,
            message: "User updated successfully.",
            data: {
                _id: updatedUser?.id,
                name: updatedUser?.name,
                email: updatedUser?.email,
                description: updatedUser?.description,
            }
        };
    }

    async delete(id: string): Promise<DeleteUserResponseDto> {

        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with ID "${id}" not found.`)
        }

        return { status: true, message: "User deleted successfully." }
    }

}
