import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // user: UserEntity,
  ): Promise<ProductEntity> {
    const { name, price, userId, password } = createProductDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPasswordFromDatabase =
      await this.usersService.getUserPasswordById(userId);

    // const isPasswordCorrect = await compare(
    //   password,
    //   hashedPasswordFromDatabase,
    // );

    // if (!isPasswordCorrect) {
    //   throw new BadRequestException('Invalid password provided');
    // }

    if (user.role !== 'vendor') {
      throw new ForbiddenException('Only vendors can create products');
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
      throw new NotFoundException('User not found');
    }

    return product;
  }
}
