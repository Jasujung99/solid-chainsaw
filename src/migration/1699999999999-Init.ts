import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1699999999999 implements MigrationInterface {
  name = 'Init1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "experiments" ("id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_experiments_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "models" ("id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_models_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "outputs" ("id" uuid NOT NULL, "s3_path" character varying NOT NULL, "metadata" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "experiment_id" uuid, "model_id" uuid, CONSTRAINT "PK_outputs_id" PRIMARY KEY ("id"), CONSTRAINT "FK_outputs_experiment" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id"), CONSTRAINT "FK_outputs_model" FOREIGN KEY ("model_id") REFERENCES "models"("id"))`);
    await queryRunner.query(`CREATE TABLE "analysis_results" ("id" uuid NOT NULL, "data" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "output_id" uuid, CONSTRAINT "PK_analysis_results_id" PRIMARY KEY ("id"), CONSTRAINT "FK_analysis_output" FOREIGN KEY ("output_id") REFERENCES "outputs"("id"))`);
    await queryRunner.query(`CREATE INDEX "idx_outputs_experiment_id" ON "outputs" ("experiment_id")`);
    await queryRunner.query(`CREATE INDEX "idx_outputs_model_id" ON "outputs" ("model_id")`);
    await queryRunner.query(`CREATE INDEX "idx_outputs_created_at" ON "outputs" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_outputs_created_at"`);
    await queryRunner.query(`DROP INDEX "idx_outputs_model_id"`);
    await queryRunner.query(`DROP INDEX "idx_outputs_experiment_id"`);
    await queryRunner.query(`DROP TABLE "analysis_results"`);
    await queryRunner.query(`DROP TABLE "outputs"`);
    await queryRunner.query(`DROP TABLE "models"`);
    await queryRunner.query(`DROP TABLE "experiments"`);
  }
}
