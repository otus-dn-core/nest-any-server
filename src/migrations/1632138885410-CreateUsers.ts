import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1632138885410 implements MigrationInterface {
  name = 'CreateUsers1632138885410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, "inactive" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'authorized', "pseudonym" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
