import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Output } from './Output';

@Entity('models')
export class Model {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Output, (output) => output.model)
  outputs!: Output[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
