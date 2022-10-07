import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { SensorJobDataDto } from '@libs/models/sensor';
import { StringUtils } from '@libs/utils';

@Injectable()
export class SensorService {
  constructor(@InjectQueue('sensor') private sensorQueue: Queue<SensorJobDataDto>) { }

  async addToQueue(req: Request, isNew = true) {
    const originalUrl = req.originalUrl;
    const headers = req.headers;
    let body = await StringUtils.getJsonBody(req);

    await this.sensorQueue.add({originalUrl, headers, body});
    const oldNew = isNew ? "New" : "Old";
    const url = isNew ? "" : originalUrl;
    Logger.debug(`Added to queue(${oldNew}):${req.realIp} ${url} ${JSON.stringify(body)}`);

    return 'success';
  }
}
