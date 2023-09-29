import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
// import { compare } from 'bcrypt';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
  ) {}
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { name, price, userId } = createProductDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'firstName',
        'email',
        'lastName',
        'password',
        'role',
        'products']
      }
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // const isPasswordCorrect = await compare(
    //   createProductDto.password,
    //   user.password,
    // );

    // if (!isPasswordCorrect) {
    //   throw new HttpException(
    //     'Invalid password provided',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    if (user.role !== 'vendor') {
      throw new HttpException(
        'Only vendors can create products',
        HttpStatus.CONFLICT,
      );
    }

    const newProduct = new ProductEntity();
    newProduct.name = name;
    newProduct.price = price;
    newProduct.user = user;

    return await this.productRepository.save(newProduct);
  }
  async findAll(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return this.productRepository.find({
      skip: offset,
      take: limit,
      relations: ['user'],
    });
  }

  async findById(productId: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });

    if (!product) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return product;
  }
}
