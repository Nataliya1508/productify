import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/users/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  usersRepository: Promise<ProductEntity>;
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productsService.createProduct(createProductDto);

    return product;
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const products = await this.productsService.findAll(page, limit);
    return { total: products.length, data: products };
  }
  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    const user = await this.productsService.findById(id);
    return user;
  }
}
