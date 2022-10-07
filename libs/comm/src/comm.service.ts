import { StringUtils } from '@libs/utils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class CommService {
  constructor(@Inject('REDIS') private redis: ClientProxy) {}

  send(cmd: string, data: any, time = 5000) {
    const sendData: any = {body: data};
    return this.redis.send(cmd, sendData).pipe(timeout(time));
  }

  async sendRequest(req: Request, cmd?: string) {
    if (!cmd) {
      cmd = this.kebabToCamel(req.params.module);
      let param1 = this.kebabToCamel(req.params.param1);
      let param2 = this.kebabToCamel(req.params.param2);
      if (param1) cmd += '.' + param1;
      if (param2) cmd += '.' + param2;
    }

    const data = await this.toSendData(req);

    Logger.debug('POST ' + req.originalUrl + " " + JSON.stringify(data.body));
    return this.redis.send(cmd, data).pipe(timeout(10000));
  }

  /**
   * 
   * @param req 
   * @returns 
   */
   async toSendData(req: Request) {
    const data:any = {};
    data.body = await StringUtils.getJsonBody(req);
    return data;
  }

  /**
   * 
   * @param path kebab case string
   * @returns camel case string
   */
   kebabToCamel(path: string) {
    if (!path) return null;
    return path.replace(/-./g, x=>x[1].toUpperCase());
  }
}
