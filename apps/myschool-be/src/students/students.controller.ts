import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './schemas/student.schema';

@Controller('students')
export class StudentsController {
 constructor(
    private readonly studentService : StudentsService
 ){}

  @Post()
  create(@Body() student: Student) {
     return this.studentService.create(student);
  }

  @Get()
  findAll(){
      return this.studentService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
      return this.studentService.findById(id);
  }
 
  @Put(':id')
  update(@Param('id') id: string, @Body() course: Partial<Student>) {
      return this.studentService.update(id, course);
  }
 
  @Delete(':id')
  delete(@Param('id') id: string) {
      return this.studentService.delete(id);
  }

}
