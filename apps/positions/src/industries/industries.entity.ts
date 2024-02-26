import { AbstractEntity } from '../../../../libs/common/src';
import { Sector } from '../sectors/sector.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Industry extends AbstractEntity<Industry> {
  @Column()
  industryName: string;

  @ManyToOne(() => Sector, (sector) => sector.industries)
  sector: Sector;
}
