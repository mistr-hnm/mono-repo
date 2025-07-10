import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserBody } from '@myschool/schema/src/api';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from 'src/lib/response-exceptions';


@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async login(user: LoginUserBody): Promise<any> {
        try {
            const existUser = await this.userModel.findOne({ email: user.email }).select(["_id","password"]);
            if (!existUser) throw new NotFoundException();

            const isMatch = await bcrypt.compare(user.password, existUser.password);
            if (!isMatch) throw new UnauthorizedException();
            
            const payload = { sub : existUser._id, email : user.email }
            const token = await this.jwtService.signAsync(payload)
            
            return {
                sucess : true,
                data : { user : existUser._id, email : user.email, token : token }
            };
        } catch (e) {
            throw new BadRequestException("User failed to login");
        }
    }

    async create(user: User): Promise<any> {
        try {
            const alreadyExist = await this.userModel.findOne({ email: user.email }).select(["_id"]);
            if (alreadyExist) throw new BadRequestException("Already exist.");

            const hash = await bcrypt.hash(user.password, 10);
            const payLoad = { ...user, password: hash };

            const newUser = new this.userModel(payLoad);
            await newUser.save();
            return {
                sucess : true,
                data : {  message: "User created", code : 200 }
            };
        } catch (e) {
            throw new BadRequestException("User creation failed.");
        }
    }

    findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    findById(id: string): Promise<User | null> {
        const user = this.userModel.findById(id);
        return user;
    }

    update(id: string, user: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }

    delete(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

}
