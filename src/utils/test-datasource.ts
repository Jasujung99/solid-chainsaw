import { DataSource } from 'typeorm';
import { newDb } from 'pg-mem';
import { v4 as uuidv4 } from 'uuid';
import { Experiment } from '../entity/Experiment';
import { Model } from '../entity/Model';
import { Output } from '../entity/Output';
import { AnalysisResult } from '../entity/AnalysisResult';
import { Init1699999999999 } from '../migration/1699999999999-Init';

export async function createTestDataSource(): Promise<DataSource> {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: 'uuid', implementation: uuidv4 });

  const ds = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [Experiment, Model, Output, AnalysisResult],
    migrations: [Init1699999999999],
  });
  await ds.initialize();
  await ds.runMigrations();
  return ds;
}
