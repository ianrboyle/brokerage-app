import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity()
export class Position extends AbstractEntity<Position> {
  @Column()
  symbol: string;

  @Column('numeric', { precision: 10, scale: 3 })
  quantity: number;

  @Column('numeric', { precision: 10, scale: 3 })
  costPerShare: number;

  @Column({ nullable: true })
  industryId: number;

  @Column()
  companyProfileId: number;

  @Column()
  userId: number;
}
