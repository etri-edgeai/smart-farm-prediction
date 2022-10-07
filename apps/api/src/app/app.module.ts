import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CommonConfigModule, CommonConfigService } from '@libs/config';
import { CommModule } from '@libs/comm';
import { AppController } from './app.controller';
import { SensorController } from './controllers/sensor.controller';
import { EdgeMonMiddleware } from './middlewares/edge-mon.middleware';
import { SensorService } from './controllers/sensor.service';

@Module({
  imports: [
    HttpModule,
    BullModule.forRootAsync({
      useFactory: (config: CommonConfigService) => ({ redis: config.redis, defaultJobOptions: {
        removeOnComplete: true, removeOnFail: true, timeout: 12 * 60 * 60 * 1000
      }}),
      inject: [CommonConfigService]
    }),
    BullModule.registerQueue({
      name: 'sensor'
    }),
    CommonConfigModule,
    CommModule.forSend()
  ],
  controllers: [AppController, SensorController],
  providers: [SensorService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(EdgeMonMiddleware).forRoutes(
      // For all edge-mon routes
      { path: '/edge', method: RequestMethod.GET }, 
      { path: '/edge/**', method: RequestMethod.ALL },
    );
  }
}
