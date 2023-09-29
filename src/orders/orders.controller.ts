import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/users/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const orders = await this.ordersService.findAll(page, limit);
    return { total: orders.length, data: orders };
  }
  @Get('/:id')
  async getOrderById(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);
    return order;
  }
}
