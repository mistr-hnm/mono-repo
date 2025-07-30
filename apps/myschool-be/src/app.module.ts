import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { routes } from './routes';
import { env } from './lib/env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { FileModule } from './modules/file/file.module';
import { SharedCacheModule } from './shared/cache/cache.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CoursesModule } from './modules/courses/courses.module';
import { StudentsModule } from './modules/students/students.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { AuthenticationMiddleware } from './core/middleware/authentication.middleware';

@Module({
  imports: [
    RouterModule.register(routes), 
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URL');
        if (!uri) {
          throw new Error("Mongo env missing!")
        }
        return { uri };
      },
      inject: [ConfigService]
    }),
    JwtModule.register({
      global: true,
      secret: env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    SharedCacheModule,
    CoursesModule,
    StudentsModule,
    UserModule,
    PermissionModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthenticationMiddleware).forRoutes("*")
  }
}
