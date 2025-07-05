import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // MongooseModule.forRoot(process.env.DB_URI,{
    //   onConnectionCreate : (connection : Connection) => {
    //     connection.on('connected',()=> { console.log("connected") });
    //     connection.on('disconnected', () => { console.log("disconnected") });
    //     return connection;
    //   }
    // }),
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
export class AppModule { }
