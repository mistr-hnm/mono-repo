import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './schemas/course.schema';

@Controller('courses')
export class CoursesController {
 constructor(
    private readonly courseService : CoursesService
 ){}


 @Post()
 create(@Body() course : Course){
    return this.courseService.create(course);
 }

 @Get()
 findAll(){
     return this.courseService.findAll();
 }

 @Get(':id')
 findById(@Param('id') id: string) {
     return this.courseService.findById(id);
 }

 @Put(':id')
 update(@Param('id') id: string, @Body() course: Partial<Course>) {
     return this.courseService.update(id, course);
 }

 @Delete(':id')
 delete(@Param('id') id: string) {
     return this.courseService.delete(id);
 }


}
