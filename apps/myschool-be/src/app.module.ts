import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './modules/courses/courses.module';
import { StudentsModule } from './modules/students/students.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
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
    CoursesModule,
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware,AuthenticationMiddleware).forRoutes("*")
  }
}
