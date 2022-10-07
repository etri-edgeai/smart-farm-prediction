import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { MakeJsonResponseInterceptor } from './../interceptors/make-json-response.interceptor';
import { SensorService } from './sensor.service';

@UseInterceptors(MakeJsonResponseInterceptor)
@Controller()
export class SensorController {
  constructor(private sensorService: SensorService) { }

  @Post('connfarm/api/device/:idx/sensor/:type.json')
  oldSensor(@Req() req) {
    return this.sensorService.addToQueue(req, false);
  }

  @Post('device/sensing')
  sensing(@Req() req) {
    
    return this.sensorService.addToQueue(req);
  }
}
