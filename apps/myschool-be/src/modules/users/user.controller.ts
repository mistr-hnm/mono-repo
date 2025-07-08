import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { LoginUserBody } from "@myschool/schema/src/api";
import { User } from './schemas/user.schema';

@Controller()
export class UserController {
 constructor(
    private readonly userService : UserService
 ){}

  @Post()
  async create(@Body() user: User) {
     return await this.userService.create(user);
  }

  @Post("/login")
  async login(@Body() user: LoginUserBody) {
    return await this.userService.login(user);  // @todo : move this to auth service
  }

  @Get()
  findAll(){
      return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
      return this.userService.findById(id);
  }
 
  @Put(':id')
  update(@Param('id') id: string, @Body() course: Partial<User>) {
      return this.userService.update(id, course);
  }
 
  @Delete(':id')
  delete(@Param('id') id: string) {
      return this.userService.delete(id);
  }

}
