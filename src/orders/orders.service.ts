import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    @InjectRepository(OrderEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { productId, userId, quantity } = createOrderDto;
    const user = await this.orderRepository.findOne({
      where: { id: userId },
      select: ['id', 'product', 'quantity', 'user'],
      }
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // const isPasswordCorrect = await compare(
    //   createOrderDto.password,
    //   user.password,
    // );

    // if (!isPasswordCorrect) {
    //   throw new HttpException(
    //     'Invalid password provided',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // } // }

    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.user.id === userId) {
      throw new HttpException(
        'You cannot order your own product',
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = new OrderEntity();
    order.user = await this.usersService.findById(userId);
    order.product = product;
    order.quantity = quantity;

    return this.orderRepository.save(order);
  }

  async findAll(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return this.orderRepository.find({
      skip: offset,
      take: limit,
      relations: ['product', 'user'],
    });
  }

  async findById(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'product'],
    });
    if (!order) {
      throw new NotFoundException('User not found');
    }

    return order;
  }
}
