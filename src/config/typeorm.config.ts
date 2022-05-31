import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";

export interface DbConfig {
    type: any;
    port: number;
    database: string;
    host: string;
    username: string;
    password: string;
    synchronize: any;
    autoLoadEntities: boolean
}

const dbConfig: DbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: parseInt(process.env.RDS_PORT) || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.ts'],
    synchronize: process.env.RDS_TYPEORM_SYNC || dbConfig.synchronize,
    autoLoadEntities: dbConfig.autoLoadEntities,
}; 