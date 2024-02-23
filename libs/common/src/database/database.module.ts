import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { LoggerModule } from '../logger/logger.module';
import { HttpExceptionFilter } from '../logger/HttpException.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const isTestEnvironment = process.env.NODE_ENV === 'test';
        const dbConnectionOptions = {
          type: 'postgres',
          database: config.get<string>('DB_DATABASE'),
          host: isTestEnvironment
            ? undefined
            : config.getOrThrow<string>('DB_HOST'),
          port: isTestEnvironment
            ? undefined
            : config.getOrThrow<number>('DB_PORT'),
          username: isTestEnvironment
            ? undefined
            : config.get<string>('DB_USERNAME'),
          password: isTestEnvironment
            ? undefined
            : config.get<string>('DB_PASSWORD'),
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 10,
          retryDelay: 3000,
        };
        return dbConnectionOptions as TypeOrmModuleOptions;
      },
    }),
  ],
  providers: [
    ConfigService,
    LoggerModule,
    {
      provide: APP_FILTER, //you have to use this custom provider
      useClass: HttpExceptionFilter, //this is your custom exception filter
    },
  ],
  exports: [ConfigService, LoggerModule],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
