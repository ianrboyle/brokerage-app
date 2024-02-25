import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity, Position } from '..';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Position, (position) => position.user)
  positions: Position[];
}
