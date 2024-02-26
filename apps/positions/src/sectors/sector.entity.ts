import { AbstractEntity } from '../../../../libs/common/src';
import { Industry } from '../industries/industries.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Sector extends AbstractEntity<Sector> {
  @Column()
  sectorName: string;

  @OneToMany(() => Industry, (industry) => industry.sector)
  industries: Industry[];
}
