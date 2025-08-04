import { DataSource } from 'typeorm';
import { createTestDataSource } from '../utils/test-datasource';
import { Experiment } from '../entity/Experiment';
import { Model } from '../entity/Model';
import { Output } from '../entity/Output';
import { AnalysisResult } from '../entity/AnalysisResult';

describe('CRUD operations', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await createTestDataSource();
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('experiment CRUD', async () => {
    const repo = dataSource.getRepository(Experiment);
    const exp = repo.create({ name: 'exp1' });
    await repo.save(exp);
    expect(await repo.findOneBy({ id: exp.id })).not.toBeNull();
    exp.name = 'exp2';
    await repo.save(exp);
    expect((await repo.findOneBy({ id: exp.id }))?.name).toBe('exp2');
    await repo.remove(exp);
    expect(await repo.findOneBy({ id: exp.id })).toBeNull();
  });

  test('model CRUD', async () => {
    const repo = dataSource.getRepository(Model);
    const model = repo.create({ name: 'm1' });
    await repo.save(model);
    expect(await repo.findOneBy({ id: model.id })).not.toBeNull();
    model.name = 'm2';
    await repo.save(model);
    expect((await repo.findOneBy({ id: model.id }))?.name).toBe('m2');
    await repo.remove(model);
    expect(await repo.findOneBy({ id: model.id })).toBeNull();
  });

  test('output CRUD', async () => {
    const expRepo = dataSource.getRepository(Experiment);
    const modelRepo = dataSource.getRepository(Model);
    const outputRepo = dataSource.getRepository(Output);

    const exp = await expRepo.save(expRepo.create({ name: 'exp' }));
    const model = await modelRepo.save(modelRepo.create({ name: 'model' }));
    const output = outputRepo.create({
      experiment: exp,
      model: model,
      s3Path: 's3://bucket/file',
      metadata: { foo: 'bar' }
    });
    await outputRepo.save(output);
    expect(await outputRepo.findOne({ where: { id: output.id }, relations: ['experiment', 'model'] })).not.toBeNull();
    output.s3Path = 's3://bucket/updated';
    await outputRepo.save(output);
    expect((await outputRepo.findOneBy({ id: output.id }))?.s3Path).toBe('s3://bucket/updated');
    await outputRepo.remove(output);
    expect(await outputRepo.findOneBy({ id: output.id })).toBeNull();
  });

  test('analysis result CRUD', async () => {
    const expRepo = dataSource.getRepository(Experiment);
    const modelRepo = dataSource.getRepository(Model);
    const outputRepo = dataSource.getRepository(Output);
    const arRepo = dataSource.getRepository(AnalysisResult);

    const exp = await expRepo.save(expRepo.create({ name: 'exp' }));
    const model = await modelRepo.save(modelRepo.create({ name: 'model' }));
    const output = await outputRepo.save(outputRepo.create({
      experiment: exp,
      model: model,
      s3Path: 's3://bucket/file',
      metadata: { foo: 'bar' }
    }));

    const ar = arRepo.create({ output, data: { result: 1 } });
    await arRepo.save(ar);
    expect(await arRepo.findOne({ where: { id: ar.id }, relations: ['output'] })).not.toBeNull();
    ar.data = { result: 2 };
    await arRepo.save(ar);
    expect((await arRepo.findOneBy({ id: ar.id }))?.data).toEqual({ result: 2 });
    await arRepo.remove(ar);
    expect(await arRepo.findOneBy({ id: ar.id })).toBeNull();
  });
});
