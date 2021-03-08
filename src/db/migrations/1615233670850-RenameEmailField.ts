import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameEmailField1615233670850 implements MigrationInterface {
  name = 'RenameEmailField1615233670850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME COLUMN "email_address" TO "email"`);
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "email" character varying(75) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "first_name" character varying(100) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "last_name" character varying(100) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "password" character varying(50) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "password" character varying(500) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "last_name" character varying(500) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "first_name" character varying(500) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "email" character varying(500) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME COLUMN "email" TO "email_address"`);
  }
}
