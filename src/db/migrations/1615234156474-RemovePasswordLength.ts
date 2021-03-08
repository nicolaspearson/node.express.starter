import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePasswordLength1615234156474 implements MigrationInterface {
  name = 'RemovePasswordLength1615234156474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "public"."user"."email" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_b7a5e4a3b174e954b2dabf2ef9e" UNIQUE ("email")`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "password" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "password" character varying(50) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_b7a5e4a3b174e954b2dabf2ef9e"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "public"."user"."email" IS NULL`);
  }
}
