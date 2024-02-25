import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity, User } from '@app/common';

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

  @ManyToOne(() => User, (user) => user.positions)
  user: User;
}
