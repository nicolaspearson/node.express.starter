import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1615049397641 implements MigrationInterface {
  name = 'InitialSchema1615049397641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."user" ("id" SERIAL NOT NULL, "first_name" character varying(500) NOT NULL, "last_name" character varying(500) NOT NULL, "email_address" character varying(500) NOT NULL, "password" character varying(500) NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."user"`);
  }
}
