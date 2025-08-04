import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Experiment } from './entity/Experiment';
import { Model } from './entity/Model';
import { Output } from './entity/Output';
import { AnalysisResult } from './entity/AnalysisResult';
import { Init1699999999999 } from './migration/1699999999999-Init';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [Experiment, Model, Output, AnalysisResult],
  migrations: [Init1699999999999],
});
