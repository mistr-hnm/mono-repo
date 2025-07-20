import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PermissionModule } from '../permission/permission.module'; 
import { SharedCacheModule } from 'src/shared/cache/cache.module';

@Module({
    imports : [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),
        PermissionModule,
        SharedCacheModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
    ]
})
export class UserModule {}
