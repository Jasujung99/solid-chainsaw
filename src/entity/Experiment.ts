import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Output } from './Output';

@Entity('experiments')
export class Experiment {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Output, (output) => output.experiment)
  outputs!: Output[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
