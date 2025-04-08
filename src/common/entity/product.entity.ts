import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Category } from './category.entity';
import { Company } from './company.entity';
import { Subcategory } from './subcategory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ unique: true })
  barcode: string;

  @OneToOne(() => Company, (company) => company.product)
  company: Relation<Company>;

  @ManyToOne(() => Category, (category) => category.products)
  category: Relation<Category>;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, { nullable: true })
  subcategory: Subcategory | null;
}
