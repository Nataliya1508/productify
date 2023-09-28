import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  usersRepository: Promise<UserEntity>;
  constructor(private readonly usersService: UsersService) {}
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('users')
  async findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const users = await this.usersService.findAll(page, limit);
    return { total: users.length, data: users };
  }
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return user;
  }
}
