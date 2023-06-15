import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        host: cs.get('POSTGRES_HOST'),
        port: cs.get('POSTGRES_PORT'),
        username: cs.get('POSTGRES_USERNAME'),
        password: cs.get('POSTGRES_PASSWORD'),
        database: cs.get('POSTGRES_DATABASE'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
