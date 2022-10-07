import { BadRequestException, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express';
import { timeout } from 'rxjs/operators';
import { Logger } from "@nestjs/common";
import { CommService } from '@libs/comm';

@Controller()
export class AppController {
  constructor(@Inject('REDIS') private redis: ClientProxy, private commService: CommService) {}

  /**
   * @deprecated old fashion
   * @param req 
   * @returns 
   */
  @Post('/api/cmd.json')
  async postCmd(@Req() req: Request) {
    const data = await this.commService.toSendData(req);
    let body = data.body;
    const cmd = body['cmd'] || body['command'];
    if (!cmd) {
      throw new BadRequestException('No request data');
    }
    data.body = body.data;

    Logger.debug('POST /api/cmd.json ' + JSON.stringify(body));
    return this.redis.send(cmd, data).pipe(timeout(10000));
  }

  @Post('/api/:module/:param1?/:param2?') 
  async postApi(@Req() req: Request) {
    return await this.commService.sendRequest(req);
  }

  @Get('/timestamp')
  timestamp() {
    return new Date().toISOString();
  }

  /*
  @Get('')
  root(@Res() response): void {
    // the homepage will load our index.html which contains angular logic
    response.sendFile(path.resolve(path.join(__dirname, '..', 'frontend/edge-mon/index.html')));
  }
  */
}
