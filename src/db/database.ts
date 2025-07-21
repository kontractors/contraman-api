import {Kysely, PostgresDialect} from "kysely";
import {Pool} from "pg";
import {DB} from "../../types/db";
import logger from "@src/utils/logger";

export let database: Kysely<DB>;

export function initDatabase() {
    if (!database) {
        const dialect = new PostgresDialect({
            pool: new Pool({
                database: process.env.DB_NAME,
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: parseInt(process.env.DB_PORT || '5432', 10),
                max: parseInt(process.env.DB_POOL_MAX || '10', 10),
            })
        });

        database = new Kysely<DB>({
            dialect
        });

        logger.info('Database instance created');
    }
}