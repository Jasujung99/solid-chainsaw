import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Output } from './Output';

@Entity('analysis_results')
export class AnalysisResult {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => Output, (output) => output.analysisResults, { nullable: false })
  output!: Output;

  @Column({ type: 'jsonb' })
  data!: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
