import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, OneToMany, BeforeInsert, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Experiment } from './Experiment';
import { Model } from './Model';
import { AnalysisResult } from './AnalysisResult';

@Entity('outputs')
@Index('idx_outputs_experiment_id', ['experiment'])
@Index('idx_outputs_model_id', ['model'])
@Index('idx_outputs_created_at', ['createdAt'])
export class Output {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => Experiment, (experiment) => experiment.outputs, { nullable: false })
  experiment!: Experiment;

  @ManyToOne(() => Model, (model) => model.outputs, { nullable: false })
  model!: Model;

  @Column({ name: 's3_path' })
  s3Path!: string;

  @Column({ type: 'jsonb' })
  metadata!: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => AnalysisResult, (ar) => ar.output)
  analysisResults!: AnalysisResult[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
