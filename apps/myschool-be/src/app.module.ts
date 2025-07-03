import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/myschool",{
      onConnectionCreate : (connection : Connection) => {
        connection.on('connected',()=> { console.log("connected") });
        connection.on('disconnected', () => { console.log("disconnected") });
        return connection;
      }
    }),
    CoursesModule,
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
