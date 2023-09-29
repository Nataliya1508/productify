import { hash } from 'bcrypt';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/enums';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @OneToMany(() => ProductEntity, (product) => product.user)
  products: ProductEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: ProductEntity[];

  @BeforeInsert()
  async hashPassword() {

    this.password = await hash(this.password, 10);
  }
}
