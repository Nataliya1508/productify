import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTables1696000365444 implements MigrationInterface {
    name = 'CreateOrdersTables1696000365444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price" integer NOT NULL`);
    }

}
