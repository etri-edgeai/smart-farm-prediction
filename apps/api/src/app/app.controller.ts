import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService, @Inject('REDIS') private redis: ClientProxy) {}
}
